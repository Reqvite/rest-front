import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { formatNumberWithTwoDecimals } from 'helpers/formatNumberWithTwoDecimals';
import { formatDateTime } from 'helpers/formatDateTime';

export const downloadBillPdf = async (restData, dishData) => {
  const doc = new jsPDF();

  doc.addImage(restData.picture, 'PNG', 95, 20, 20, 20);

  doc.setFontSize(12);
  const restaurant = restData.name;
  const restaurantWidth = doc.getTextWidth(restaurant);
  doc.text(restaurant, (210 - restaurantWidth) / 2, 50);

  doc.setFontSize(8);
  const address = `Address: ${restData.address}`;
  const addressWidth = doc.getTextWidth(address);
  doc.text(address, 210 - addressWidth - 20, 55);

  const phone = `Phone: ${restData.phone}`;
  const phoneWidth = doc.getTextWidth(phone);
  doc.text(phone, 210 - phoneWidth - 20, 60);

  const website = `Website: ${restData.website}`;
  const websiteWidth = doc.getTextWidth(website);
  doc.text(website, 210 - websiteWidth - 20, 65);

  const tableData = dishData.map((item) => [
    item.name,
    item.quantity,
    `${formatNumberWithTwoDecimals(item.price)}`,
    `${formatNumberWithTwoDecimals(item.quantity * item.price)}`,
  ]);

  const subtotal = dishData.reduce((total, data) => total + data.amount, 0);
  const subtotalRow = ['Total', '', '', `$${formatNumberWithTwoDecimals(subtotal)}`];
  tableData.push(subtotalRow);

  const tableStyles = {
    fontSize: 10,
    cellPadding: 5,
    valign: 'middle',
    halign: 'center',
    lineColor: [248, 156, 95],
  };

  doc.autoTable({
    head: [['Description', 'Qty', 'Price', 'Total']],
    body: tableData,
    startY: 70,
    theme: 'grid',
    headStyles: {
      fillColor: [248, 156, 95],
    },
    styles: tableStyles,
  });
  const tableHeight = 80 + (dishData.length + 2) * 15;

  doc.setFontSize(8);
  const dateDoc = formatDateTime(new Date());
  const dateDocWidth = doc.getTextWidth(dateDoc);
  doc.text(dateDoc, 210 - dateDocWidth - 20, tableHeight);

  doc.save(`${restData.name.replace(/\s+/g, '')}.pdf`);
};
