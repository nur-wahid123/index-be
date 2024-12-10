import { Response } from 'express';
import { PDFUtil, TPdfColumn } from 'src/commons/utils/pdf.util';
import { Student } from 'src/entities/student.entity';
import { SemesterReport } from 'src/entities/semester.entity';
import { Gender } from 'src/enums/gender.enum';
import { formatDateToExactString } from 'src/commons/utils/date.util';
import { Parents } from 'src/entities/parents.entity';
import { Guardian } from 'src/entities/guardian.entity';

type TData = Student;

export class StudentExportPdfUtil extends PDFUtil {
  private readonly title = 'Index Siswa';
  private data: TData;

  constructor(student: TData, userName: string) {
    super(userName);
    this.data = student;
  }
  public async generate(res: Response) {
    const doc = this.start(res);
    let [{}, y] = this.setLayout(this.title);

    y = doc.y + 3;
    this.drawHeaderNewPage(doc, doc.page.margins.left, y);
    this.drawFooter();
    this.addPage();
    doc
      .fontSize(20)
      .font(this.boldFont)
      .text('Nilai Siswa', 0, y, { align: 'center' });
    y = doc.y + 10;
    for (let index = 0; index < this.data.semesterReports.length; index++) {
      const element = this.data.semesterReports[index];
      if (index !== 0) {
        this.drawFooter();
        this.addPage();
        y = doc.y + 10;
      }
      doc
        .fontSize(15)
        .font(this.boldFont)
        .text(
          `Nilai kelas ${element.classType} semester ${element.semester}`,
          0,
          y,
          { align: 'center' },
        );
      y = doc.y + 10;
      this.drawHeaderContentNewPage(doc, doc.page.margins.left, y, element);
      y = doc.y + 10;
      const columns: TPdfColumn[] = [
        { text: 'No.', alignment: 'left', width: 30 },
        { text: 'Mata Pelajaran', alignment: 'left', width: 400 },
        { text: 'Nilai', alignment: 'center', width: 70 },
      ];
      const tableData = this.mappingTableData(element);
      this.drawTable(columns, tableData, doc.page.margins.left, y, this.title);
      y = doc.y;
      const columnsExtra: TPdfColumn[] = [
        { text: 'No.', alignment: 'left', width: 30 },
        { text: 'Ekstrakurikuler', alignment: 'left', width: 400 },
        { text: 'Nilai', alignment: 'center', width: 70 },
      ];
      const tableDataExtra = this.mappingTableDataEkstra(element);
      this.drawTable(
        columnsExtra,
        tableDataExtra,
        doc.page.margins.left,
        y,
        this.title,
      );
    }
    this.drawFooter();

    doc.end();
  }

  private mappingTableData(dataItem: SemesterReport): string[][] {
    const data: string[][] = [];
    for (let i = 0; i < dataItem.scores.length; i++) {
      const item = dataItem.scores[i];
      data.push([`${i + 1}`, item.subject.name, `${item.scoreValue}`]);
    }
    data.push(['', 'Total Nilai', `${dataItem.totalScore}`]);
    data.push(['', 'Rata-rata', `${Number(dataItem.averageScore).toFixed(2)}`]);

    return data;
  }

  private mappingTableDataEkstra(dataItem: SemesterReport): string[][] {
    const data: string[][] = [];
    for (let i = 0; i < dataItem.extracurricularScores.length; i++) {
      const item = dataItem.extracurricularScores[i];
      data.push([`${i + 1}`, item.extracurricular.name, `${item.score}`]);
    }
    data.push(['', '', ``]);
    data.push(['', 'Absen', `${dataItem.absentDays}`]);
    data.push(['', 'Izin', `${dataItem.leaveDays}`]);
    data.push(['', 'Sakit', `${dataItem.sickDays}`]);
    data.push(['', 'Ranking', `${dataItem.ranking}`]);
    return data;
  }

  private drawHeaderNewPage(
    doc: PDFKit.PDFDocument,
    startX: number,
    y: number,
  ) {
    const generateData = (
      parent: Parents | Guardian,
    ): { title: string; value: string }[] => {
      if (!parent) {
        return [
          { title: 'Nama', value: dotDot },
          { title: 'Tahun Lahir', value: dotDot },
          {
            title: 'Agama',
            value: dotDot,
          },
          {
            title: 'Kewarganegaraan',
            value: dotDot,
          },
          {
            title: 'Pendidikan',
            value: dotDot,
          },
          {
            title: 'Pekerjaan',
            value: dotDot,
          },
          {
            title: 'Penghasilan per bulan',
            value: dotDot,
          },
          {
            title: 'Alamat Rumah',
            value: `${dotDot}`,
          },
          {
            title: 'Masih Hidup/ Meninggal',
            value: dotDot,
          },
        ];
      }
      return [
        { title: 'Nama', value: parent ? parent.name : dotDot },
        { title: 'Tahun Lahir', value: `${parent.yearOfBirth ?? dotDot}` },
        {
          title: 'Agama',
          value: `${parent.religion ? parent.religion.name : dotDot}`,
        },
        {
          title: 'Kewarganegaraan',
          value: `${parent.citizenship ? parent.citizenship.name : dotDot}`,
        },
        {
          title: 'Pendidikan',
          value: `${parent.education ? parent.education.name : dotDot}`,
        },
        {
          title: 'Pekerjaan',
          value: `${parent.job ? parent.job.name : dotDot}`,
        },
        {
          title: 'Penghasilan per bulan',
          value: `${parent.income ? parent.income.name : dotDot}`,
        },
        {
          title: 'Alamat Rumah',
          value: `${dotDot}`,
        },
        {
          title: 'Masih Hidup/ Meninggal',
          value: `${parent.isAlive ? 'Masih Hidup' : 'Meninggal'}`,
        },
      ];
    };
    const dotDot = '..............................................';
    const headerData: {
      title: string;
      items: { title: string; value: string }[];
    }[] = [
      {
        title: `A. KETERANGAN TENTANG DIRI PESERTA DIDIK`,
        items: [
          { title: 'Nama', value: this.data.name },
          { title: 'NISN', value: this.data.studentNationalId },
          { title: 'NIK', value: this.data.nik },
          { title: 'NIS', value: this.data.studentSchoolId ?? dotDot },
          {
            title: 'Jenis Kelamin',
            value: this.data.gender === Gender.L ? 'Laki-laki' : 'Perempuan',
          },
          {
            title: 'Tempat dan Tanggal Lahir',
            value: `${this.data.placeOfBirth}, ${formatDateToExactString(new Date(this.data.dateOfBirth))}`,
          },
          { title: 'Agama', value: this.data.religion.name ?? dotDot },
          {
            title: 'Kewarganegaraan',
            value: this.data.citizenship ? this.data.citizenship.name : dotDot,
          },
          {
            title: 'Anak ke berapa',
            value: `${this.data.childOrder ?? dotDot}`,
          },
          {
            title: 'Jumlah Saudara',
            value: `${this.data.numberOfSiblings ?? dotDot}`,
          },
        ],
      },
      {
        title: `B. KETERANGAN TEMPAT TINGGAL`,
        items: [
          { title: 'Alamat', value: this.data.address ?? dotDot },
          {
            title: 'Nomor Telepon/HP',
            value: `${this.data.telephone ?? dotDot} / ${this.data.phoneNumber ?? dotDot}`,
          },
          {
            title: 'Jenis Tempat Tinggal',
            value: this.data.kindOfStay.name ?? dotDot,
          },
          {
            title: 'Jarak tempat tinggal ke sekolah',
            value: `${this.data.distanceFromSchool ?? dotDot} KM`,
          },
        ],
      },
      {
        title: `C. KETERANGAN KESEHATAN`,
        items: [
          {
            title: 'Golongan Darah',
            value: this.data.typeOfBlood ? this.data.typeOfBlood.name : dotDot,
          },
          {
            title: 'Penyakit yang pernah diderita',
            value: `${this.data.disability ?? dotDot}`,
          },
          {
            title: 'Kelainan Jasmani',
            value: dotDot,
          },
          {
            title: 'Tinggi dan Berat Badan',
            value: `${this.data.height ?? dotDot} cm / ${this.data.weight ?? dotDot} kg`,
          },
        ],
      },
      {
        title: `D. KETERANGAN PENDIDIKAN`,
        items: [
          {
            title: 'Pendidikan Sebelumnya',
            value: this.data.juniorSchoolName ?? dotDot,
          },
          {
            title: 'Tanggal dan Nomor Ijazah',
            value: `${this.data.graduationSertificateNumber ?? dotDot}`,
          },
          {
            title: 'Tanggal dan Nomor STL',
            value: dotDot,
          },
          {
            title: 'Lama Belajar',
            value: `${this.data.yearsOnJuniorSchool ?? dotDot} Tahun`,
          },
        ],
      },
      {
        title: `E. KETERANGAN TENTANG AYAH KANDUNG`,
        items: generateData(this.data.father),
      },
      {
        title: `F. KETERANGAN TENTANG IBU KANDUNG`,
        items: generateData(this.data.mother),
      },
      {
        title: `G. KETERANGAN TENTANG WALI`,
        items: generateData(this.data.guardian),
      },
    ];
    const marginY = 3;

    y += 10;

    for (let index = 0; index < headerData.length; index++) {
      const element = headerData[index];
      doc
        .fontSize(16)
        .font(this.boldFont)
        .text(`${element.title} `, startX, y, {
          width: 500,
          align: 'left',
        });
      y = doc.y + marginY;
      for (let index2 = 0; index2 < element.items.length; index2++) {
        const itemHeader = element.items[index2];
        const addMargin = 18;
        doc
          .fontSize(this.fontSize)
          .font(this.font)
          .text(`${itemHeader.title} `, startX + addMargin, y, {
            width: 200,
            align: 'left',
          });

        doc
          .fontSize(this.fontSize)
          .font(this.font)
          .text(`: ` + itemHeader.value, startX + 203 + addMargin, y, {
            width: 300,
            align: 'left',
          });

        y = doc.y + marginY;
      }
      y = doc.y + marginY + 15;
      this.addPageAuto(
        this.computeHeight(headerData[index + 1].items.length),
        startX,
        'halo boi',
      );
    }
  }

  private computeHeight(length: number) {
    const textHeight = 16;
    const titleHeight = 20;
    const marginY = 3;

    return textHeight * length + titleHeight + marginY * length;
  }

  private drawHeaderContentNewPage(
    doc: PDFKit.PDFDocument,
    startX: number,
    y: number,
    semesterReport: SemesterReport,
  ) {
    const metadata = semesterReport.metadata as any;
    const headerData: { title: string; value: string }[] = [
      { title: 'Tipe Kelas', value: semesterReport.classType },
      { title: 'Semester', value: semesterReport.semester },
      { title: 'Tahun', value: semesterReport.schholYear },
    ];
    if (metadata) {
      headerData.unshift({
        title: 'Wali Kelas',
        value: String(metadata.homeroom_teacher ?? '-'),
      });
      headerData.unshift({
        title: 'Kelas',
        value: String(metadata.class_name ?? '-'),
      });
    }
    const marginY = 3;

    y += 10;

    for (let index2 = 0; index2 < headerData.length; index2++) {
      const itemHeader = headerData[index2];
      doc
        .fontSize(this.fontSize)
        .font(this.boldFont)
        .text(`${itemHeader.title} `, startX, y, {
          width: 150,
          align: 'left',
        });

      doc
        .fontSize(this.fontSize)
        .font(this.font)
        .text(`: ` + itemHeader.value, startX + 153, y, {
          width: 200,
          align: 'left',
        });

      y = doc.y + marginY;
    }
  }

  private drawFooterData(
    doc: PDFKit.PDFDocument,
    startX: number,
    y: number,
    semesterReport: SemesterReport,
  ) {
    const footerData: { title: string; value: string }[] = [
      { title: 'Tipe Kelas', value: semesterReport.classType },
      { title: 'Semester', value: semesterReport.semester },
      { title: 'Tahun', value: semesterReport.schholYear },
    ];
    const marginY = 3;

    y += 10;

    for (let index2 = 0; index2 < footerData.length; index2++) {
      const itemFooter = footerData[index2];
      doc
        .fontSize(this.fontSize)
        .font(this.boldFont)
        .text(`${itemFooter.title} `, startX, y, {
          width: 150,
          align: 'left',
        });

      doc
        .fontSize(this.fontSize)
        .font(this.font)
        .text(`: ` + itemFooter.value, startX + 153, y, {
          width: 200,
          align: 'left',
        });

      y = doc.y + marginY;
    }
  }

  public drawTableCustom(
    doc: PDFKit.PDFDocument,
    columns: Array<TPdfColumn>,
    tableData: string[][],
    startX: number,
    startY: number,
    docHeader?: string,
    maxOffset = 100, // mengira ngira jarak konten paling bawah dengan padding paling bawah
  ) {
    const pageHeight = doc.page.height;
    const rowHeight = 15;
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
          yPosition = doc.y; // Reset Y position for new page
          if (docHeader) {
            doc
              .fontSize(10)
              .font(this.boldFont)
              .text(docHeader, startX, yPosition);
            yPosition += 25;
          }
          yPosition += 10;
          this.drawHeaderNewPage(doc, startX, doc.y);
          yPosition += 18;
          this.drawRow(columns, this.boldFont, startX, yPosition);
          yPosition += rowHeight;
        }
      } else {
        if (yPosition + rowHeight > pageHeight - 50) {
          this.drawFooter();
          this.addPage();
          yPosition = doc.y; // Reset Y position for new page
          if (docHeader) {
            doc
              .fontSize(10)
              .font(this.boldFont)
              .text(docHeader, startX, yPosition);
            yPosition += 25;
          }
          yPosition += 10;
          this.drawHeaderNewPage(doc, startX, doc.y);
          yPosition += 18;
          this.drawRow(columns, this.boldFont, startX, yPosition);
          yPosition += rowHeight;
        }
      }

      this.drawRow(row, this.font, startX, yPosition);
      yPosition += rowHeight;
    }
  }
}
