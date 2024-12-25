import { PDFUtil, TPdfColumn } from 'src/commons/utils/pdf.util';
import { Student } from 'src/entities/student.entity';
import { SemesterReport } from 'src/entities/semester.entity';
import { Gender } from 'src/enums/gender.enum';
import { formatDateToExactString } from 'src/commons/utils/date.util';
import { Parents } from 'src/entities/parents.entity';
import { Guardian } from 'src/entities/guardian.entity';
import { ClassType } from 'src/enums/class-type.enum';
import { PassThrough } from 'stream';
import { Response } from 'express';
import { SchoolProfile } from 'src/entities/school-profile.entity';

type TData = Student;

class ClassReport {
  classType: ClassType;
  schoolYears: string[];
  homeRoomTeachers: string[];
  className: string[];
  reports: SemesterReport[];
  schoolChiefName: string[];
}

export class StudentExportPdfUtil extends PDFUtil {
  private readonly title = 'BIODATA SISWA';
  private data: TData;
  private schoolProfile: SchoolProfile;

  constructor(student: TData, userName: string, schoolProfile?: SchoolProfile) {
    super(userName);
    this.data = student;
    this.schoolProfile = schoolProfile;
  }

  public async generate(res: Response) {
    const doc = this.start(res);
    let [{}, y] = this.setLayout('');

    y = doc.y + 3;
    this.drawHeaderNewPage(doc, doc.page.margins.left, y);
    if (this.data.semesterReports.length > 0) {
      this.drawFooter();
      this.addPage();
      y = doc.y - 8;
      doc
        .fontSize(20)
        .font(this.boldFont)
        .text('LAPORAN CAPAIAN KOMPETENSI', 0, y, { align: 'center' });
      y = doc.y + 10;
      const classReport: ClassReport[] = [];
      for (let index = 0; index < this.data.semesterReports.length; index++) {
        const element = this.data.semesterReports[index];
        let clsRpt = classReport.find((v) => {
          return v.classType === element.classType && v.reports.length < 2;
        });
        const metadata = element.metadata as any;
        if (!clsRpt) {
          clsRpt = new ClassReport();
          clsRpt.classType = element.classType;
          clsRpt.schoolYears = [element.schholYear];
          clsRpt.className = [metadata ? metadata.class_name : ''];
          clsRpt.homeRoomTeachers = [metadata ? metadata.homeroom_teacher : ''];
          clsRpt.reports = [element];
          clsRpt.schoolChiefName = [metadata ? metadata.school_chief_name : ''];
          classReport.push(clsRpt);
        } else {
          clsRpt.reports.push(element);
          clsRpt.schoolYears.push(element.schholYear);
          clsRpt.className.push(metadata ? metadata.class_name : '');
          clsRpt.schoolChiefName.push(
            metadata ? metadata.school_chief_name : '',
          );
          clsRpt.homeRoomTeachers.push(
            metadata ? metadata.homeroom_teacher : '',
          );
        }
      }
      for (let index = 0; index < classReport.length; index++) {
        const element = classReport[index];
        if (index !== 0) {
          this.drawFooter();
          this.addPage();
          y = doc.y + 10;
        }
        const tableWidth = 545;
        this.drawHeaderContentNewPage(doc, doc.page.margins.left, y, element);
        y = doc.y + 10;
        const tableData = this.mappingTableData(element);
        const columns: TPdfColumn[] = [
          { text: 'No.', alignment: 'left', width: 30 },
          {
            text: 'Mata Pelajaran',
            alignment: 'left',
            width: tableWidth - tableData.numberOfSemester * 80,
          },
        ];

        for (let i = 0; i < tableData.numberOfSemester; i++) {
          columns.push({
            text: `Semester ${i + 1}`,
            alignment: 'center',
            width: 80,
          });
        }
        this.drawTable(
          columns,
          tableData.tableData,
          doc.page.margins.left,
          y,
          this.title,
        );
        y = doc.y;
        const columnsExtra: TPdfColumn[] = [
          { text: 'No.', alignment: 'left', width: 30 },
          {
            text: 'Ekstrakurikuler',
            alignment: 'left',
            width: tableWidth - tableData.numberOfSemester * 80,
          },
        ];
        for (let index = 0; index < tableData.numberOfSemester; index++) {
          columnsExtra.push({ text: 'Nilai', alignment: 'center', width: 80 });
        }
        const tableDataExtra = this.mappingTableDataEkstra(element);
        this.drawTable(
          columnsExtra,
          tableDataExtra,
          doc.page.margins.left,
          y,
          this.title,
        );
        this.drawFooterContent(doc, doc.page.margins.left, y, element);
      }
    }
    this.drawFooter();
    doc.end();
  }

  public async generateStream(outputStream: PassThrough) {
    const doc = this.startStream(outputStream);
    let [{}, y] = this.setLayout(this.title);

    y = doc.y + 3;
    this.drawHeaderNewPage(doc, doc.page.margins.left, y);
    if (this.data.semesterReports.length > 0) {
      this.drawFooter();
      this.addPage();
      y = doc.y - 8;
      doc
        .fontSize(20)
        .font(this.boldFont)
        .text('LAPORAN CAPAIAN KOMPETENSI', 0, y, { align: 'center' });
      y = doc.y + 10;
      const classReport: ClassReport[] = [];
      for (let index = 0; index < this.data.semesterReports.length; index++) {
        const element = this.data.semesterReports[index];
        let clsRpt = classReport.find((v) => {
          return v.classType === element.classType;
        });
        const metadata = element.metadata as any;
        if (!clsRpt) {
          clsRpt = new ClassReport();
          clsRpt.classType = element.classType;
          clsRpt.schoolYears = [element.schholYear];
          clsRpt.className = [metadata ? metadata.class_name : ''];
          clsRpt.homeRoomTeachers = [metadata ? metadata.homeroom_teacher : ''];
          clsRpt.reports = [element];
          classReport.push(clsRpt);
        } else {
          clsRpt.schoolYears.push(element.schholYear);
          clsRpt.className.push(metadata ? metadata.class_name : '');
          clsRpt.homeRoomTeachers.push(
            metadata ? metadata.homeroom_teacher : '',
          );
          clsRpt.reports.push(element);
        }
      }
      for (let index = 0; index < classReport.length; index++) {
        const element = classReport[index];
        if (index !== 0) {
          this.drawFooter();
          this.addPage();
          y = doc.y + 10;
        }
        const tableWidth = 545;
        this.drawHeaderContentNewPage(doc, doc.page.margins.left, y, element);
        y = doc.y + 10;
        const tableData = this.mappingTableData(element);
        const columns: TPdfColumn[] = [
          { text: 'No.', alignment: 'left', width: 30 },
          {
            text: 'Mata Pelajaran',
            alignment: 'left',
            width: tableWidth - tableData.numberOfSemester * 80,
          },
        ];

        for (let i = 0; i < tableData.numberOfSemester; i++) {
          columns.push({
            text: `Semester ${i + 1}`,
            alignment: 'center',
            width: 80,
          });
        }
        this.drawTable(
          columns,
          tableData.tableData,
          doc.page.margins.left,
          y,
          this.title,
        );
        y = doc.y;
        const columnsExtra: TPdfColumn[] = [
          { text: 'No.', alignment: 'left', width: 30 },
          {
            text: 'Ekstrakurikuler',
            alignment: 'left',
            width: tableWidth - tableData.numberOfSemester * 80,
          },
        ];
        for (let index = 0; index < tableData.numberOfSemester; index++) {
          columnsExtra.push({ text: 'Nilai', alignment: 'center', width: 80 });
        }
        const tableDataExtra = this.mappingTableDataEkstra(element);
        this.drawTable(
          columnsExtra,
          tableDataExtra,
          doc.page.margins.left,
          y,
          this.title,
        );
      }
    }
    this.drawFooter();
    doc.end();
  }

  private mappingTableData(dataItem: ClassReport): {
    tableData: string[][];
    numberOfSemester: number;
  } {
    const data: string[][] = [];
    const reportData: {
      index: string;
      name: string;
      id: number;
      scores: string[];
    }[] = [];
    for (let index = 0; index < dataItem.reports.length; index++) {
      const element = dataItem.reports[index];
      for (let j = 0; j < element.scores.length; j++) {
        const score = element.scores[j];
        const rpt = reportData.find((report) => report.id === score.subject.id);
        if (rpt) {
          rpt.scores.push(score.scoreValue.toString());
        } else {
          reportData.push({
            index: `${j + 1}`,
            name: `${score.subject.name}`,
            id: score.subject.id,
            scores: [score.scoreValue.toString()],
          });
        }
      }
    }
    for (let index = 0; index < reportData.length; index++) {
      const element = reportData[index];
      data.push([element.index, element.name, ...element.scores]);
    }

    return { tableData: data, numberOfSemester: dataItem.reports.length };
  }

  private mappingTableDataEkstra(dataItem: ClassReport): string[][] {
    const data: string[][] = [];
    const reportData: {
      index: string;
      name: string;
      id?: number;
      scores: string[];
    }[] = [];
    for (let index = 0; index < dataItem.reports.length; index++) {
      const element = dataItem.reports[index];
      for (let j = 0; j < element.extracurricularScores.length; j++) {
        const score = element.extracurricularScores[j];
        const rpt = reportData.find(
          (report) => report.id === score.extracurricular.id,
        );
        if (rpt) {
          rpt.scores.push(score.score.toString());
        } else {
          reportData.push({
            index: `${j + 1}`,
            name: `${score.extracurricular.name}`,
            id: score.extracurricular.id,
            scores: [score.score.toString()],
          });
        }
      }
    }
    reportData.push({
      index: ``,
      name: ``,
      scores: [...dataItem.reports.map(() => ``)],
    });
    const addedRow = [
      { title: 'sickDays', value: 'Sakit' },
      { title: 'absentDays', value: 'Izin' },
      { title: 'leaveDays', value: 'Alpha' },
    ];
    for (let index = 0; index < dataItem.reports.length; index++) {
      const element = dataItem.reports[index];
      for (let j = 0; j < addedRow.length; j++) {
        const row = addedRow[j];
        const rpt = reportData.find((report) => report.name === row.value);
        if (rpt) {
          rpt.scores.push(String(element[row.title]));
        } else {
          reportData.push({
            index: ``,
            name: `${row.value}`,
            scores: [String(element[row.title])],
          });
        }
      }
    }
    for (let index = 0; index < reportData.length; index++) {
      const element = reportData[index];
      data.push([element.index, element.name, ...element.scores]);
    }

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
    const dotDot = '....................................';
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
      {
        title: `H. KEGEMARAN PESERTA DIDIK`,
        items: [
          { title: 'Kesenian', value: this.data.favouriteArt ?? dotDot },
          { title: 'Olah Raga', value: this.data.favouriteSport ?? dotDot },
          {
            title: 'Kemasyarakatan / Organisasi',
            value: this.data.favouriteSport ?? dotDot,
          },
          { title: 'lain-lain', value: dotDot },
        ],
      },
      {
        title: `I. KETERANGAN PERKEMBANGAN PESERTA DIDIK`,
        items: [
          {
            title: 'Menerima Beasiswa',
            value: `Tahun....................../Kls......................dari......................`,
          },
          {
            title: '',
            value: `Tahun....................../Kls......................dari......................`,
          },
          {
            title: '',
            value: `Tahun....................../Kls......................dari......................`,
          },
          { title: 'Olah Raga', value: this.data.favouriteSport ?? dotDot },
          {
            title: 'Meninggalkan sekolah ini',
            value: dotDot,
          },
          {
            title: 'Tanggal Meninggalkan Sekolah',
            value: dotDot,
          },
          { title: 'Alasan', value: dotDot },
          { title: 'Akhir Pendidikan', value: dotDot },
          { title: 'Lulus', value: dotDot },
          { title: 'Ijazah', value: dotDot },
          { title: 'Nomor Surat Tanda Lulus/STL', value: dotDot },
          { title: 'Nilai rata-rata yang dicapai', value: dotDot },
        ],
      },
      {
        title: 'J. KETERANGAN SETELAH SELESAI PENDIDIKAN',
        items: [
          { title: 'Akan melanjutkan ke', value: dotDot },
          { title: 'Akan bekerja di', value: dotDot },
        ],
      },
    ];
    const marginY = 3;

    y += 10;

    for (let index = 0; index < headerData.length; index++) {
      const element = headerData[index];
      if (
        this.addPageAuto(this.computeHeight(element.items.length), startX, '')
      ) {
        y = 40 + marginY;
      }
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
            width: 370,
            align: 'left',
          });
        y = doc.y + marginY;
      }
      y = doc.y + marginY;
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
    classReport: ClassReport,
  ) {
    const headerData: { title: string; value: string }[] = [
      {
        title: 'Nama',
        value: this.data.name ?? `...............................`,
      },
      {
        title: 'Tahun Pelajaran',
        value: Array.from(new Set(classReport.schoolYears)).join(' '),
      },
      {
        title: 'Kelas',
        value: Array.from(new Set(classReport.className)).join(' '),
      },
    ];

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

  private drawFooterContent(
    doc: PDFKit.PDFDocument,
    startX: number,
    y: number,
    classReport: ClassReport,
  ) {
    const marginY = 3;

    y += 10;

    y = doc.y + marginY + 10;
    let width = 0;
    doc
      .fontSize(this.fontSize)
      .font(this.font)
      .text(`Status Akhir Tahun Pelajaran :`, startX, y, {
        width: 200,
        align: 'center',
      });
    width += 200;
    doc
      .fontSize(this.fontSize)
      .font(this.font)
      .text(
        `${classReport.classType === ClassType.XII ? 'Lulus/Tidak Lulus' : 'Naik Kelas/Tidak Naik Kelas'}`,
        startX + width,
        y,
        {
          width: 150,
          align: 'center',
        },
      );
    y = doc.y + marginY + 10;
    width = 0;
    for (let index = 0; index < classReport.reports.length; index++) {
      doc
        .fontSize(this.fontSize)
        .font(this.boldFont)
        .text(`Wali Kelas`, startX + width, y, {
          width: 110,
          align: 'center',
        });
      width += 110;
      width += 26;
      doc
        .fontSize(this.fontSize)
        .font(this.boldFont)
        .text(`Kepala Sekolah`, startX + width, y, {
          width: 110,
          align: 'center',
        });
      width += 110;
      width += 26;
    }
    y = doc.y + marginY;
    width = 0;
    for (let index = 0; index < classReport.reports.length; index++) {
      const element = classReport.reports[index];
      doc
        .fontSize(this.fontSize)
        .font(this.boldFont)
        .text(`Semester ${element.semester}`, startX + width, y, {
          width: 110,
          align: 'center',
        });
      width += 110;
      width += 26;
      doc
        .fontSize(this.fontSize)
        .font(this.boldFont)
        .text(`Semester ${element.semester}`, startX + width, y, {
          width: 110,
          align: 'center',
        });
      width += 110;
      width += 26;
    }
    y = doc.y + marginY + 40;
    width = 0;
    for (let index = 0; index < classReport.homeRoomTeachers.length; index++) {
      const homeroom = classReport.homeRoomTeachers[index];
      const school_chief_name = classReport.schoolChiefName[index];
      doc
        .fontSize(this.fontSize)
        .font(this.font)
        .text(`${homeroom} `, startX + width, y, {
          width: 110,
          align: 'center',
        });
      width += 110;
      width += 26;
      doc
        .fontSize(this.fontSize)
        .font(this.font)
        .text(`${school_chief_name} `, startX + width, y, {
          width: 110,
          align: 'center',
        });
      width += 110;
      width += 26;
    }
    y = doc.y + marginY;
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
