'use strict';

/**
 * A set of functions called "actions" for `PDF`
 */

const PDFDocument = require('pdfkit')
const fs = require('fs')


class PDFDocumentWithTables extends PDFDocument {
  constructor(options) {
      super(options);
  }

  table(table, arg0, arg1, arg2) {
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

      const prepareHeader = options.prepareHeader || (() => { });
      const prepareRow = options.prepareRow || (() => { });
      const columnWidthsDistribution = options.columnWidthsDistribution || null;
      const computeRowHeight = (row) => {
          let result = 0;

          row.forEach((cell, i) => {
              const cellHeight = this.heightOfString(cell, {
                  width: columnWidthsDistribution ? (columnWidthsDistribution[i] * usableWidth) - columnSpacing : columnWidth,
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
          this.text(header, startX + (columnWidthsDistribution ? (columnWidthsDistribution.filter((e, j) => j < i).reduce((acc, v) => acc + v, 0) * usableWidth) : i * columnContainerWidth), startY, {
              width: columnWidthsDistribution ? (columnWidthsDistribution[i] * usableWidth) - columnSpacing : columnWidth,
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
              this.text(cell, startX + (columnWidthsDistribution ? (columnWidthsDistribution.filter((e, j) => j < i).reduce((acc, v) => acc + v, 0) * usableWidth) : i * columnContainerWidth), startY, {
                  width: columnWidthsDistribution ? (columnWidthsDistribution[i] * usableWidth) - columnSpacing : columnWidth,
                  align: 'left'
              })
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
    try {
      ctx.set('Content-Security-Policy', "frame-ancestors 'self' http://127.0.0.1:8080/")

      const doc = new PDFDocumentWithTables({ size: 'A4' })
      
      doc.fontSize(25).text('PDF Generato', 0, 50, { align: 'center' })

      const { image = null } = ctx.request.body      
      
      doc.fontSize(10)
      doc.image(image, 10, 100, { width: 500, height: 300, fit: [575, 300], align: 'center', valign: 'center' })
      doc.table({
        headers: [],
        rows: [['aaa', 'bbb', 'ccc']],
          columnsWidthDistribution: [0.33, 0.33, 0.33],
        }, 10, 400);
      
      doc.pipe(ctx.res)
      doc.end()

      ctx.res.writeHead(200, { 'Content-Type': 'application/pdf' })

      return new Promise(resolve => ctx.res.on('finish', resolve))

    } catch (err) {
      ctx.body = err;
      console.log(err)
    }
  }
};
