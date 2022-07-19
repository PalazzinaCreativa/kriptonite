module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/pdf/generate',
      handler: 'pdf.generatePDF',
    }
  ]
}