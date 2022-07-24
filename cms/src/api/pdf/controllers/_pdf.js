'use strict';

/**
 * A set of functions called "actions" for `PDF`
 */

const PDFDocument = require('pdfkit')
const fs = require('fs')
var conversion = require("phantom-html-to-pdf")();

class PDFDocumentWithTables extends PDFDocument {
    constructor (options) {
        super(options);
    }

    table (table, arg0, arg1, arg2) {
        let startX = this.page.margins.left, startY = this.y;
        let options = {};

        if ((typeof arg0 === 'number') && (typeof arg1 === 'number')) {
            startX = arg0;
            startY = arg1;

            if (typeof arg2 === 'object')
                options = arg2;
        } else if (typeof arg0 === 'object') {
            options = arg0;
        }

        const columnCount = table.headers.length;
        const columnSpacing = options.columnSpacing || 15;
        const rowSpacing = options.rowSpacing || 5;
        const usableWidth = options.width || (this.page.width - this.page.margins.left - this.page.margins.right);

        const prepareHeader = options.prepareHeader || (() => {});
        const prepareRow = options.prepareRow || (() => {});
        const computeRowHeight = (row) => {
            let result = 0;

            row.forEach((cell) => {
                const cellHeight = this.heightOfString(cell, {
                    width: columnWidth,
                    align: 'left'
                });
                result = Math.max(result, cellHeight);
            });

            return result + rowSpacing;
        };

        const columnContainerWidth = usableWidth / columnCount;
        const columnWidth = columnContainerWidth - columnSpacing;
        const maxY = this.page.height - this.page.margins.bottom;

        let rowBottomY = 0;

        this.on('pageAdded', () => {
            startY = this.page.margins.top;
            rowBottomY = 0;
        });

        // Allow the user to override style for headers
        prepareHeader();

        // Check to have enough room for header and first rows
        if (startY + 3 * computeRowHeight(table.headers) > maxY)
            this.addPage();

        // Print all headers
        table.headers.forEach((header, i) => {
            this.text(header, startX + i * columnContainerWidth, startY, {
                width: columnWidth,
                align: 'left'
            });
        });

        // Refresh the y coordinate of the bottom of the headers row
        rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

        // Separation line between headers and rows
        this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
            .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
            .lineWidth(2)
            .stroke();

        table.rows.forEach((row, i) => {
            const rowHeight = computeRowHeight(row);

            // Switch to next page if we cannot go any further because the space is over.
            // For safety, consider 3 rows margin instead of just one
            if (startY + 3 * rowHeight < maxY)
                startY = rowBottomY + rowSpacing;
            else
                this.addPage();

            // Allow the user to override style for rows
            prepareRow(row, i);

            // Print all cells of the current row
            row.forEach((cell, i) => {
                this.text(cell, startX + i * columnContainerWidth, startY, {
                    width: columnWidth,
                    align: 'left'
                });
            });

            // Refresh the y coordinate of the bottom of this row
            rowBottomY = Math.max(startY + rowHeight, rowBottomY);

            // Separation line between rows
            this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
                .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
                .lineWidth(1)
                .opacity(0.7)
                .stroke()
                .opacity(1); // Reset opacity after drawing the line
        });

        this.x = startX;
        this.moveDown();
        
        return this;
      }
    }
    

module.exports = {
  generatePDF: async (ctx, next) => {
    conversion({ html: "<h1>Hello World</h1>" }, function(err, pdf) {
      var output = fs.createWriteStream()
      console.log(pdf.logs)
      console.log(pdf.numberOfPages)
        // since pdf.stream is a node.js stream you can use it
        // to save the pdf to a file (like in this example) or to
        // respond an http request.
      pdf.stream.pipe(ctx.res)

      return new Promise(resolve => { 
        ctx.res.writeHead(200, { 'Content-Type': 'application/pdf' })
        ctx.res.on('finish', resolve)
      })
    });
  }

//   generatePDF: async (ctx, next) => {
//     try {
//       ctx.set('Content-Security-Policy', "frame-ancestors 'self' http://127.0.0.1:8080/")
//       const configuration = await strapi.entityService.findMany('api::configuration.configuration', {
//         filter:  {
//             code: '126c4663-5945-49b5-bd62-ecef2ad42feb'
//         },
//          limit: 1
//       })
//       const { infos } = configuration[0].infos
//       console.log(infos)
//       const doc = new PDFDocumentWithTables({ size: 'A4' })
//       const { image = null } = ctx.request.body
      
//       doc.fontSize(25).text('KRIPTONITE', 10, 50, { align: 'left' })

//       doc.fontSize(10)
      
//       doc.image(image, 10, 60, { width: 500, height: 300, fit: [575, 300], align: 'center', valign: 'center' })

//       doc.fontSize(25).text('Sistema ' + infos.product.type, 10, 350, { align: 'left' })
//       doc.moveDown().text()
//     //   doc.table({
//     //     headers: [],
//     //     rows: [        [
//     //         'Apple',
//     //         'Not this one',
//     //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.',
//     //       ],
//     //       [
//     //         'Tire',
//     //         'Smells like funny',
//     //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.',
//     //       ],],
//     //       columnsWidthDistribution: [0.33, 0.33, 0.33],
//     //     }, 10, 400);

//         const table0 = {
//             headers: ['Word', 'Comment', 'Summary'],
//             rows: [
//                 ['Apple', 'Not this one', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.'],
//                 ['Tire', 'Smells like funny', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.']
//             ]
//         };

//         //doc.moveDown().table(table0, 10, 350, { width: 575 });
//         // doc.moveDown(300).table(table0, {
//         //     prepareHeader: () => doc.font('Helvetica-Bold'),
//         //     prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
//         // });
      
//       doc.pipe(ctx.res)
//       doc.end()

//       return new Promise(resolve => { 
//         ctx.res.writeHead(200, { 'Content-Type': 'application/pdf' })
//         ctx.res.on('finish', resolve)
//       })

//     } catch (err) {
//       ctx.body = err;
//       console.log(err)
//     }
//   }
};
