import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import { jakartaTZdate } from './date.util';

export class TPdfColumn {
  constructor(
    text: string,
    alignment: 'left' | 'right' | 'center' = 'left',
    width: number,
  ) {
    this.text = text;
    this.alignment = alignment;
    this.width = width;
  }
  text: string;
  alignment?: 'left' | 'right' | 'center' = 'left';
  width? = 70;
}

export class PDFUtil {
  public font = 'Arialnarrow';
  public boldFont = 'Arialnarrow-Bold';
  public fontSize = 14;
  public fontSizeH5 = 12;
  private userName: string;
  private currentPage: number;
  private doc: PDFKit.PDFDocument;

  constructor(userName: string) {
    this.userName = userName;
    const doc = new PDFDocument({
      autoFirstPage: false,
    });
    this.doc = doc;
    // Stream the PDF to the response
  }

  public start(res: Response) {
    this.currentPage = 0;
    this.doc.on('pageAdded', () => {
      this.currentPage += 1;
    });

    this.doc.pipe(res);

    this.doc.registerFont(
      this.boldFont,
      `${__dirname}/../../../../font/arial-narrow/arialnarrow_bold.ttf`,
    );

    this.doc.registerFont(
      this.font,
      `${__dirname}/../../../../font/arial-narrow/arialnarrow.ttf`,
    );
    return this.doc;
  }

  public setLayout(
    title: string,
    docTitle = 'SMAN 1 Srengat',
  ): [x: number, y: number] {
    this.addPage();

    const x = this.doc.page.margins.left;
    let y = this.doc.page.margins.top;

    this.doc
      .fontSize(20)
      .font(this.boldFont)
      .text(docTitle, x, y, { align: 'center' });
    y += 25;
    this.doc
      .fontSize(15)
      .font(this.boldFont)
      .text(title, x, y, { align: 'center' });

    return [x, y];
  }

  public addPageAuto(
    contentHeight: number,
    x: number,
    title: string,
    condition?: boolean,
    maxContentHeight = 200, // Ngira ngira keseluruhan tinggi 1 data
  ): boolean {
    const defaultCondition =
      this.doc.y > maxContentHeight &&
      this.doc.page.height - // Tinggi keseluruhan page
        this.doc.y - // Tinggi content sekarang
        contentHeight < // Tinggi data
        20; // Jarak max document footer dengan data di page now

    if (condition !== undefined ? condition : defaultCondition) {
      this.drawFooter();
      this.addPage();
      this.doc.fontSize(10).font(this.boldFont).text(title, x, this.doc.y);
      return true;
    }
    return false;
  }

  public addPage(
    size = 'A4',
    margins = {
      top: 10,
      left: 10,
      right: 30,
      bottom: 10,
    },
  ) {
    this.doc.addPage({
      autoFirstPage: false,
      compress: true,
      size: size,
      margins: margins,
    });
  }

  // Draw the table
  public drawTable(
    columns: Array<TPdfColumn>,
    tableData: string[][],
    startX: number,
    startY: number,
    docHeader?: string,
    maxOffset = 100, // mengira ngira jarak konten paling bawah dengan padding paling bawah,
    pageHeader: {
      startX: number;
      items: { key: string; value: string }[];
    } = null,
  ) {
    const pageHeight = this.doc.page.height;
    const rowHeight = 20;
    let yPosition = startY;

    // Draw header
    this.drawRow(columns, this.boldFont, startX, yPosition);
    yPosition += rowHeight;

    // Draw rows
    for (let i = 0; i < tableData.length; i++) {
      // Create a row body text
      const row: TPdfColumn[] = [];
      for (let j = 0; j < tableData[i].length; j++) {
        row.push({
          text: tableData[i][j],
          width: columns[j].width,
          alignment: columns[j].alignment,
        });
      }

      // Check if next row exceeds page height
      if (i == tableData.length - 1) {
        if (yPosition + rowHeight > pageHeight - maxOffset) {
          this.drawFooter();
          this.addPage();
          yPosition = this.doc.y; // Reset Y position for new page
          if (docHeader) {
            this.doc
              .fontSize(10)
              .font(this.boldFont)
              .text(docHeader, startX, yPosition);
            yPosition += 25;
          }
          if (pageHeader) this.drawFields(pageHeader);
          this.drawRow(columns, this.boldFont, startX, yPosition);
          yPosition += rowHeight;
        }
      } else {
        if (yPosition + rowHeight > pageHeight - 50) {
          this.drawFooter();
          this.addPage();
          yPosition = this.doc.y; // Reset Y position for new page
          if (docHeader) {
            this.doc
              .fontSize(10)
              .font(this.boldFont)
              .text(docHeader, startX, yPosition);
            yPosition += 25;
          }
          if (pageHeader) this.drawFields(pageHeader);
          this.drawRow(columns, this.boldFont, startX, yPosition);
          yPosition += rowHeight;
        }
      }

      this.drawRow(row, this.font, startX, yPosition);
      yPosition += rowHeight;
    }
  }

  public drawFields(data: {
    startX: number;
    items: { key: string; value: string }[];
  }) {
    const marginY = 3;
    const fieldWidth = 80;

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const y = this.doc.y;

      this.doc
        .fontSize(this.fontSize)
        .font(this.font)
        .text(`${item.key}:`, data.startX, y, {
          width: fieldWidth,
          align: 'right',
        });

      this.doc
        .fontSize(this.fontSize)
        .font(this.font)
        .text(item.value, data.startX + fieldWidth + 3, y, {
          width: fieldWidth + 100,
          align: 'left',
        });

      this.doc.y += marginY;
    }

    this.doc.y += marginY;
  }

  // Draw a single row
  public drawRow(
    row: TPdfColumn[],
    font: string,
    startX: number,
    startY: number,
  ) {
    for (let i = 0; i < row.length; i++) {
      const cell = row[i].text;
      const columnWidth = row[i].width;
      this.doc.rect(startX, startY, columnWidth, 20).stroke();
      // Determine text alignment
      const alignment = row[i].alignment;
      const stringMaxWidth = columnWidth / 4.6;

      const xOffset = alignment == 'right' ? 5 * -1 : 5;
      this.doc
        .fontSize(this.fontSize)
        .font(font)
        .text(
          cell?.substring(0, stringMaxWidth),
          startX + xOffset,
          startY + 3,
          {
            width: columnWidth,
            align: alignment,
          },
        );

      startX += columnWidth;
    }
  }

  public drawFooter() {
    const pageWidth = this.doc.page.width;
    const pageHeight = this.doc.page.height;
    const fontSize = 8;

    const footerTextLeft = `Dicetak oleh: ${this.userName} [${jakartaTZdate(
      new Date(),
    )}]`;
    const footerTextRight = `Page ${this.currentPage}`;
    // Add a horizontal line
    this.doc
      .undash()
      .moveTo(this.doc.page.margins.left, pageHeight - 40)
      .lineTo(pageWidth - this.doc.page.margins.left, pageHeight - 40)
      .fillColor('black')
      .stroke();

    // Add left-aligned text
    this.doc
      .fontSize(fontSize)
      .font(this.font)
      .fillColor('black')
      .text(footerTextLeft, this.doc.page.margins.left, pageHeight - 35, {
        align: 'left',
        width: pageWidth,
      });

    // Add right-aligned text
    this.doc
      .fontSize(fontSize)
      .font(this.font)
      .fillColor('black')
      .text(footerTextRight, 0, pageHeight - 35, {
        align: 'right',
        width: pageWidth - this.doc.page.margins.right,
      });
  }

  public formatThousandSeparated(x: number): string {
    return (+x)?.toFixed()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
  }

  public formatCurrency(x: number): string {
    return (+x)?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0.00';
  }

  /**
   * @deprecated untuk hitung tinggi header manual, tapi jangan dimasukin function karena peforma down
   * Hitung keseluruhan header
   * headerHigh(177) - (
   *  (textHeight(11) * totalField(2)) -
   *  (marginTop(10) + titlePage(10) + paddingHeaderTop(20) + paddingHeaderBottom(5))
   * ) = 177 - 22 - 45 = 120
   *  = 177 - 67 = 110
   */
  protected virtualContentHeight<T>(
    data: T,
    callback: (...arg0: any[]) => void,
  ): number {
    const doc = new PDFDocument({
      // autoFirstPage: false,
    });

    doc.registerFont(
      this.boldFont,
      `${__dirname}/../../../../../../font/arial-narrow/arialnarrow_bold.ttf`,
    );
    doc.registerFont(
      this.font,
      `${__dirname}/../../../../../../font/arial-narrow/arialnarrow.ttf`,
    );
    callback(doc, data, doc.x, doc.y);

    return doc.y;
  }
}
