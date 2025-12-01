import type { PortfolioPdfData, PortfolioPdfProject } from '@/types/PortfolioPdf';

export type PortfolioDocxFormat = 'standard' | 'table' | 'resume' | 'career';

const EXPERIENCE_LABELS: Record<string, string> = {
    internship: 'インターンシップ',
    extracurricular: '課外活動',
    awards: '受賞歴',
    summary: 'サマリー',
};

type DocxModule = typeof import('docx');
type DocxChild = InstanceType<DocxModule['Paragraph']> | InstanceType<DocxModule['Table']>;

interface ExtractedPortfolioDetails {
    displayName: string;
    universityLine: string;
    gradeLine: string;
    email: string;
    phone: string;
    address: string;
    profile: string;
    skills: string[];
    certifications: string[];
    projects: PortfolioPdfProject[];
    experienceEntries: Array<{ key: string; label: string; value: string }>;
    hopeNote: string;
    createdDateLabel: string;
}

const normalizeExperienceValue = (raw: unknown): string => {
    if (raw == null) {
        return '';
    }

    const coerceString = (value: unknown): string => {
        if (typeof value === 'string') {
            return value.trim();
        }
        if (value == null) {
            return '';
        }
        return String(value).trim();
    };

    const tryParseObject = (text: string): string => {
        if (!text) {
            return '';
        }

        const startsWithJsonToken = (input: string) => {
            const firstChar = input[0];
            return firstChar === '{' || firstChar === '[';
        };

        if (!startsWithJsonToken(text)) {
            return text;
        }

        try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
                const items = parsed
                    .map(coerceString)
                    .filter((item) => item.length > 0);
                return items.join('\n');
            }
            if (parsed && typeof parsed === 'object') {
                const entries = Object.entries(parsed)
                    .map(([key, value]) => {
                        const normalized = coerceString(value);
                        if (!normalized) {
                            return '';
                        }
                        const label = EXPERIENCE_LABELS[key] ?? key;
                        return `${label}: ${normalized}`;
                    })
                    .filter((item) => item.length > 0);
                if (entries.length > 0) {
                    return entries.join('\n');
                }
            }
        } catch {
            return text;
        }

        return text;
    };

    if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (!trimmed) {
            return '';
        }
        return tryParseObject(trimmed);
    }

    if (typeof raw === 'object') {
        try {
            return tryParseObject(JSON.stringify(raw));
        } catch {
            return '';
        }
    }

    return coerceString(raw);
};

const extractPortfolioDetails = (data: PortfolioPdfData): ExtractedPortfolioDetails => {
    const { user, portfolio } = data;

    const displayName = portfolio?.name || user?.name || '氏名未設定';
    const universityLine = [portfolio?.university || user?.university, portfolio?.faculty || user?.faculty]
        .filter(Boolean)
        .join(' / ');
    const gradeLine = portfolio?.grade || user?.grade || '';
    const email = portfolio?.email || user?.email || '未登録';
    const phone = portfolio?.phone || user?.phone || '未登録';
    const address = portfolio?.address || user?.address || '未登録';
    const profile = portfolio?.selfIntroduction || user?.selfIntroduction || '自己紹介が登録されていません。';
    const skills = portfolio?.skillTags?.length ? portfolio.skillTags : [];
    const certifications = portfolio?.certifications?.length ? portfolio.certifications : [];
    const projects = portfolio?.projects?.length ? portfolio.projects : [];
    const experience = portfolio?.experience ?? {};
    const other = portfolio?.other ?? {};

    const experienceEntries = Object.entries(experience)
        .map(([key, value]) => {
            const normalized = normalizeExperienceValue(value);
            if (!normalized) {
                return null;
            }
            return {
                key,
                label: EXPERIENCE_LABELS[key] ?? key,
                value: normalized,
            };
        })
        .filter((entry): entry is { key: string; label: string; value: string } => entry !== null);

    const trimmedAdditionalInfo = typeof other.additionalInfo === 'string' ? other.additionalInfo.trim() : '';
    const trimmedCustomQuestions = typeof other.customQuestions === 'string' ? other.customQuestions.trim() : '';

    const hopeNote = trimmedAdditionalInfo || trimmedCustomQuestions || '特記事項はありません。';
    const createdDateLabel = new Date().toLocaleDateString('ja-JP');

    return {
        displayName,
        universityLine,
        gradeLine,
        email,
        phone,
        address,
        profile,
        skills,
        certifications,
        projects,
        experienceEntries,
        hopeNote,
        createdDateLabel,
    };
};

const createHeadingParagraph = (
    docx: DocxModule,
    text: string,
    level?: string
) =>
    new docx.Paragraph({
        text,
        heading: level,
        spacing: {
            before: 240,
            after: 160,
        },
    });

const createMutedParagraph = (docx: DocxModule, text: string) =>
    new docx.Paragraph({
        children: [
            new docx.TextRun({
                text,
                color: '6B7280',
            }),
        ],
        spacing: {
            after: 160,
        },
    });

const createBulletParagraph = (docx: DocxModule, text: string) =>
    new docx.Paragraph({
        children: [
            new docx.TextRun({ text })
        ],
        bullet: {
            level: 0,
        },
        spacing: {
            after: 120,
        },
    });

const createKeyValueTable = (
    docx: DocxModule,
    rows: Array<{ key: string; value: string }>
) => {
    const { Table, TableRow, TableCell, WidthType, Paragraph, TextRun } = docx;

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rows.map(({ key, value }) =>
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 30, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: key, bold: true }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 70, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({ text: value || '未登録' }),
                        ],
                    }),
                ],
            })
        ),
    });
};

const createSpacingParagraph = (docx: DocxModule, after = 200) =>
    new docx.Paragraph({
        text: '',
        spacing: { after },
    });

const createMultilineParagraphs = (docx: DocxModule, text: string, options?: { indent?: number }) => {
    const lines = text.split(/\r?\n/);
    return lines.map((line) =>
        new docx.Paragraph({
            text: line || '',
            indent: options?.indent ? { left: options.indent } : undefined,
            spacing: { after: 120 },
        })
    );
};

const buildStandardContent = (docx: DocxModule, details: ExtractedPortfolioDetails): DocxChild[] => {
    const { Paragraph, HeadingLevel, AlignmentType, TextRun } = docx;
    const children: DocxChild[] = [];

    children.push(
        new Paragraph({
            text: details.displayName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
        })
    );

    if (details.universityLine) {
        children.push(
            new Paragraph({
                text: details.universityLine,
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
            })
        );
    }

    if (details.gradeLine) {
        children.push(
            new Paragraph({
                text: details.gradeLine,
                alignment: AlignmentType.CENTER,
                spacing: { after: 240 },
            })
        );
    } else {
        children.push(createSpacingParagraph(docx));
    }

    children.push(createHeadingParagraph(docx, '連絡先', HeadingLevel.HEADING_2));
    children.push(
        createKeyValueTable(docx, [
            { key: 'メール', value: details.email },
            { key: '電話', value: details.phone },
            { key: '住所', value: details.address },
        ])
    );
    children.push(createSpacingParagraph(docx));

    children.push(createHeadingParagraph(docx, 'プロフィール', HeadingLevel.HEADING_2));
    for (const paragraph of createMultilineParagraphs(docx, details.profile)) {
        children.push(paragraph);
    }

    children.push(createSpacingParagraph(docx));

    children.push(createHeadingParagraph(docx, 'スキル', HeadingLevel.HEADING_2));
    if (details.skills.length > 0) {
        details.skills.forEach((skill) => {
            children.push(createBulletParagraph(docx, skill));
        });
    } else {
        children.push(createMutedParagraph(docx, 'スキル情報が登録されていません。'));
    }

    children.push(createSpacingParagraph(docx));
    children.push(createHeadingParagraph(docx, 'プロジェクト・経験', HeadingLevel.HEADING_2));
    if (details.projects.length > 0) {
        details.projects.forEach((project) => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: project.name || 'タイトル未設定',
                            bold: true,
                        }),
                    ],
                    spacing: { after: 80 },
                })
            );
            if (project.period) {
                children.push(new Paragraph({ text: `期間: ${project.period}`, indent: { left: 720 } }));
            }
            if (project.role) {
                children.push(new Paragraph({ text: `役割: ${project.role}`, indent: { left: 720 } }));
            }
            if (project.technologies && project.technologies.length > 0) {
                children.push(new Paragraph({ text: `使用技術: ${project.technologies.join(', ')}`, indent: { left: 720 } }));
            }
            if (project.description) {
                const descriptionParagraphs = createMultilineParagraphs(docx, project.description, { indent: 720 });
                descriptionParagraphs.forEach((item) => children.push(item));
            }
            if (project.url) {
                children.push(new Paragraph({ text: project.url, indent: { left: 720 } }));
            }
            children.push(createSpacingParagraph(docx, 160));
        });
    } else {
        children.push(createMutedParagraph(docx, 'プロジェクト情報が登録されていません。'));
    }

    if (details.experienceEntries.length > 0) {
        children.push(createHeadingParagraph(docx, 'その他の経験', HeadingLevel.HEADING_2));
        details.experienceEntries.forEach((entry) => {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: entry.label, bold: true })],
                    spacing: { after: 60 },
                })
            );
            const paragraphs = createMultilineParagraphs(docx, entry.value, { indent: 720 });
            paragraphs.forEach((item) => children.push(item));
            children.push(createSpacingParagraph(docx, 120));
        });
    }

    if (details.universityLine) {
        children.push(createHeadingParagraph(docx, '学歴', HeadingLevel.HEADING_2));
        children.push(
            new Paragraph({
                text: details.universityLine,
                children: details.gradeLine
                    ? [
                          new TextRun({ text: ` (${details.gradeLine})`, italics: true }),
                      ]
                    : undefined,
            })
        );
        children.push(createSpacingParagraph(docx));
    }

    children.push(createHeadingParagraph(docx, '資格・認定', HeadingLevel.HEADING_2));
    if (details.certifications.length > 0) {
        details.certifications.forEach((cert) => {
            children.push(createBulletParagraph(docx, cert));
        });
    } else {
        children.push(createMutedParagraph(docx, '資格情報が登録されていません。'));
    }

    return children;
};

const createHeaderRow = (docx: DocxModule, headers: string[], columnWeights: number[]) => {
    const { TableRow, TableCell, Paragraph, TextRun, WidthType } = docx;
    return new TableRow({
        tableHeader: true,
        children: headers.map((header, index) =>
            new TableCell({
                width: { size: columnWeights[index], type: WidthType.PERCENTAGE },
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: header, bold: true })],
                    }),
                ],
                shading: {
                    fill: 'F3F4F6',
                },
            })
        ),
    });
};

const createValueCell = (
    docx: DocxModule,
    text: string,
    widthPercent: number
) => new docx.TableCell({
    width: { size: widthPercent, type: docx.WidthType.PERCENTAGE },
    children: [new docx.Paragraph({ text: text || '' })],
});

const buildTableContent = (docx: DocxModule, details: ExtractedPortfolioDetails): DocxChild[] => {
    const { Table, TableRow, WidthType, Paragraph, HeadingLevel } = docx;
    const children: DocxChild[] = [];

    children.push(
        new Paragraph({
            text: details.displayName,
            heading: HeadingLevel.TITLE,
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 120 },
        })
    );

    if (details.universityLine) {
        children.push(new Paragraph({ text: details.universityLine, alignment: docx.AlignmentType.CENTER }));
    }
    if (details.gradeLine) {
        children.push(new Paragraph({ text: details.gradeLine, alignment: docx.AlignmentType.CENTER, spacing: { after: 240 } }));
    } else {
        children.push(createSpacingParagraph(docx));
    }

    children.push(createHeadingParagraph(docx, '連絡先', HeadingLevel.HEADING_2));
    children.push(
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                createHeaderRow(docx, ['項目', '内容'], [30, 70]),
                new TableRow({
                    children: [
                        createValueCell(docx, 'メール', 30),
                        createValueCell(docx, details.email, 70),
                    ],
                }),
                new TableRow({
                    children: [
                        createValueCell(docx, '電話', 30),
                        createValueCell(docx, details.phone, 70),
                    ],
                }),
                new TableRow({
                    children: [
                        createValueCell(docx, '住所', 30),
                        createValueCell(docx, details.address, 70),
                    ],
                }),
            ],
        })
    );
    children.push(createSpacingParagraph(docx));

    children.push(createHeadingParagraph(docx, 'スキル', HeadingLevel.HEADING_2));
    children.push(
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                createHeaderRow(docx, ['No.', 'スキル名'], [20, 80]),
                ...(details.skills.length > 0
                    ? details.skills.map((skill, index) =>
                          new TableRow({
                              children: [
                                  createValueCell(docx, String(index + 1), 20),
                                  createValueCell(docx, skill, 80),
                              ],
                          })
                      )
                    : [
                          new TableRow({
                              children: [
                                  new docx.TableCell({
                                      width: { size: 100, type: WidthType.PERCENTAGE },
                                      columnSpan: 2,
                                      children: [createMutedParagraph(docx, 'スキル情報が登録されていません。')],
                                  }),
                              ],
                          }),
                      ]),
            ],
        })
    );
    children.push(createSpacingParagraph(docx));

    children.push(createHeadingParagraph(docx, '経験・実績', HeadingLevel.HEADING_2));
    children.push(
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                createHeaderRow(docx, ['期間', 'プロジェクト名', '詳細'], [20, 30, 50]),
                ...(details.projects.length > 0
                    ? details.projects.map((project) =>
                          new TableRow({
                              children: [
                                  createValueCell(docx, project.period || '期間未設定', 20),
                                  createValueCell(docx, project.name || 'タイトル未設定', 30),
                                  new docx.TableCell({
                                      width: { size: 50, type: WidthType.PERCENTAGE },
                                      children: [
                                          ...[
                                              project.role ? `役割: ${project.role}` : '',
                                              project.technologies && project.technologies.length > 0
                                                  ? `使用技術: ${project.technologies.join(', ')}`
                                                  : '',
                                              project.description || '',
                                              project.url || '',
                                          ]
                                              .filter(Boolean)
                                              .map((line) => new docx.Paragraph({ text: line })),
                                      ],
                                  }),
                              ],
                          })
                      )
                    : [
                          new TableRow({
                              children: [
                                  new docx.TableCell({
                                      width: { size: 100, type: WidthType.PERCENTAGE },
                                      columnSpan: 3,
                                      children: [createMutedParagraph(docx, 'プロジェクト情報が登録されていません。')],
                                  }),
                              ],
                          }),
                      ]),
            ],
        })
    );
    children.push(createSpacingParagraph(docx));

    if (details.universityLine) {
        children.push(createHeadingParagraph(docx, '学歴', HeadingLevel.HEADING_2));
        children.push(
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    createHeaderRow(docx, ['期間', '学校・専攻', '備考'], [20, 50, 30]),
                    new docx.TableRow({
                        children: [
                            createValueCell(docx, details.gradeLine || '在籍中', 20),
                            createValueCell(docx, details.universityLine, 50),
                            createValueCell(docx, '', 30),
                        ],
                    }),
                ],
            })
        );
        children.push(createSpacingParagraph(docx));
    }

    children.push(createHeadingParagraph(docx, '資格・認定', HeadingLevel.HEADING_2));
    children.push(
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                createHeaderRow(docx, ['No.', '資格名'], [20, 80]),
                ...(details.certifications.length > 0
                    ? details.certifications.map((cert, index) =>
                          new TableRow({
                              children: [
                                  createValueCell(docx, String(index + 1), 20),
                                  createValueCell(docx, cert, 80),
                              ],
                          })
                      )
                    : [
                          new TableRow({
                              children: [
                                  new docx.TableCell({
                                      width: { size: 100, type: WidthType.PERCENTAGE },
                                      columnSpan: 2,
                                      children: [createMutedParagraph(docx, '資格情報が登録されていません。')],
                                  }),
                              ],
                          }),
                      ]),
            ],
        })
    );

    return children;
};

const buildResumeContent = (docx: DocxModule, details: ExtractedPortfolioDetails): DocxChild[] => {
    const { Paragraph, HeadingLevel, AlignmentType, TextRun, Table, TableRow, TableCell, WidthType } = docx;
    const children: DocxChild[] = [];

    children.push(
        new Paragraph({
            text: '履歴書',
            heading: HeadingLevel.TITLE,
            spacing: { after: 120 },
        })
    );
    children.push(
        new Paragraph({
            text: `作成日: ${details.createdDateLabel}`,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 160 },
        })
    );

    // 基本情報
    children.push(createHeadingParagraph(docx, '基本情報', HeadingLevel.HEADING_2));
    children.push(
        new Paragraph({
            children: [new TextRun({ text: `氏名: ${details.displayName}` })],
            spacing: { after: 80 },
        })
    );
    if (details.universityLine) {
        children.push(new Paragraph({ text: `学校・学部: ${details.universityLine}`, spacing: { after: 80 } }));
    }
    if (details.gradeLine) {
        children.push(new Paragraph({ text: `学年: ${details.gradeLine}`, spacing: { after: 160 } }));
    } else {
        children.push(createSpacingParagraph(docx));
    }

    children.push(new Paragraph({ text: `現住所: ${details.address}`, spacing: { after: 80 } }));
    children.push(new Paragraph({ text: `電話番号: ${details.phone}`, spacing: { after: 80 } }));
    children.push(new Paragraph({ text: `メールアドレス: ${details.email}`, spacing: { after: 160 } }));

    if (details.universityLine) {
        children.push(createHeadingParagraph(docx, '学歴・職歴', HeadingLevel.HEADING_2));
        children.push(
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                children: [createMutedParagraph(docx, '学歴')],
                            }),
                            new TableCell({
                                width: { size: 70, type: WidthType.PERCENTAGE },
                                children: [new Paragraph({ text: details.universityLine })],
                            }),
                        ],
                    }),
                    ...(details.gradeLine
                        ? [
                              new TableRow({
                                  children: [
                                      new TableCell({
                                          width: { size: 30, type: WidthType.PERCENTAGE },
                                          children: [createMutedParagraph(docx, '在籍状況')],
                                      }),
                                      new TableCell({
                                          width: { size: 70, type: WidthType.PERCENTAGE },
                                          children: [new Paragraph({ text: details.gradeLine })],
                                      }),
                                  ],
                              }),
                          ]
                        : []),
                ],
            })
        );
        children.push(createSpacingParagraph(docx));
    }

    children.push(createHeadingParagraph(docx, '資格・免許', HeadingLevel.HEADING_2));
    if (details.certifications.length > 0) {
        details.certifications.forEach((cert) => {
            children.push(createBulletParagraph(docx, cert));
        });
    } else {
        children.push(createMutedParagraph(docx, '資格情報が登録されていません。'));
    }

    children.push(createHeadingParagraph(docx, '志望動機・自己PR', HeadingLevel.HEADING_2));
    for (const paragraph of createMultilineParagraphs(docx, details.profile)) {
        children.push(paragraph);
    }

    children.push(createHeadingParagraph(docx, '本人希望欄', HeadingLevel.HEADING_2));
    for (const paragraph of createMultilineParagraphs(docx, details.hopeNote)) {
        children.push(paragraph);
    }

    return children;
};

const buildCareerContent = (docx: DocxModule, details: ExtractedPortfolioDetails): DocxChild[] => {
    const { Paragraph, HeadingLevel, AlignmentType, TextRun } = docx;
    const children: DocxChild[] = [];

    children.push(
        new Paragraph({
            text: '職務経歴書',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
        })
    );

    children.push(createHeadingParagraph(docx, '基本情報', HeadingLevel.HEADING_2));
    children.push(new Paragraph({ text: details.displayName, spacing: { after: 60 } }));
    children.push(new Paragraph({ text: details.address, spacing: { after: 60 } }));
    children.push(new Paragraph({ text: details.phone, spacing: { after: 60 } }));
    children.push(new Paragraph({ text: details.email, spacing: { after: 60 } }));
    if (details.universityLine) {
        children.push(new Paragraph({ text: details.universityLine, spacing: { after: 160 } }));
    } else {
        children.push(createSpacingParagraph(docx));
    }

    children.push(createHeadingParagraph(docx, 'プロフィール', HeadingLevel.HEADING_2));
    for (const paragraph of createMultilineParagraphs(docx, details.profile)) {
        children.push(paragraph);
    }

    children.push(createHeadingParagraph(docx, '保有スキル', HeadingLevel.HEADING_2));
    if (details.skills.length > 0) {
        details.skills.forEach((skill) => children.push(createBulletParagraph(docx, skill)));
    } else {
        children.push(createMutedParagraph(docx, 'スキル情報が登録されていません。'));
    }

    children.push(createHeadingParagraph(docx, 'プロジェクト経験', HeadingLevel.HEADING_2));
    if (details.projects.length > 0) {
        details.projects.forEach((project) => {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: project.name || 'タイトル未設定', bold: true })],
                    spacing: { after: 60 },
                })
            );
            if (project.period) {
                children.push(new Paragraph({ text: project.period, indent: { left: 720 } }));
            }
            if (project.role) {
                children.push(new Paragraph({ text: `役割: ${project.role}`, indent: { left: 720 } }));
            }
            if (project.technologies && project.technologies.length > 0) {
                children.push(new Paragraph({ text: `使用技術: ${project.technologies.join(', ')}`, indent: { left: 720 } }));
            }
            if (project.description) {
                const descriptionParagraphs = createMultilineParagraphs(docx, project.description, { indent: 720 });
                descriptionParagraphs.forEach((item) => children.push(item));
            }
            if (project.url) {
                children.push(new Paragraph({ text: project.url, indent: { left: 720 } }));
            }
            children.push(createSpacingParagraph(docx, 160));
        });
    } else {
        children.push(createMutedParagraph(docx, 'プロジェクト情報が登録されていません。'));
    }

    if (details.experienceEntries.length > 0) {
        children.push(createHeadingParagraph(docx, 'その他の経験', HeadingLevel.HEADING_2));
        details.experienceEntries.forEach((entry) => {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: entry.label, bold: true })],
                    spacing: { after: 60 },
                })
            );
            const paragraphs = createMultilineParagraphs(docx, entry.value, { indent: 720 });
            paragraphs.forEach((item) => children.push(item));
            children.push(createSpacingParagraph(docx, 120));
        });
    }

    children.push(createHeadingParagraph(docx, '資格・免許', HeadingLevel.HEADING_2));
    if (details.certifications.length > 0) {
        details.certifications.forEach((cert) => children.push(createBulletParagraph(docx, cert)));
    } else {
        children.push(createMutedParagraph(docx, '資格情報が登録されていません。'));
    }

    return children;
};

const buildContentByFormat = (docx: DocxModule, details: ExtractedPortfolioDetails, format: PortfolioDocxFormat): DocxChild[] => {
    switch (format) {
        case 'table':
            return buildTableContent(docx, details);
        case 'resume':
            return buildResumeContent(docx, details);
        case 'career':
            return buildCareerContent(docx, details);
        case 'standard':
        default:
            return buildStandardContent(docx, details);
    }
};

export const generatePortfolioDocx = async (
    data: PortfolioPdfData,
    format: PortfolioDocxFormat
): Promise<Blob> => {
    if (!data.portfolio) {
        throw new Error('ポートフォリオ情報が見つかりません。');
    }

    const docx = await import('docx');
    const { Document, Packer, convertMillimetersToTwip } = docx;

    const details = extractPortfolioDetails(data);
    const children = buildContentByFormat(docx, details, format);

    const mmToTwip = (mm: number) => {
        if (typeof convertMillimetersToTwip === 'function') {
            return convertMillimetersToTwip(mm);
        }
        return Math.round(mm * 56.6929133858);
    };

    const pageWidthTwip = mmToTwip(210);
    const pageHeightTwip = mmToTwip(297);

    const document = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: mmToTwip(20),
                            right: mmToTwip(20),
                            bottom: mmToTwip(20),
                            left: mmToTwip(20),
                        },
                        size: {
                            width: pageWidthTwip,
                            height: pageHeightTwip,
                        },
                    },
                },
                children: children as DocxChild[],
            },
        ],
    });

    return Packer.toBlob(document);
};
