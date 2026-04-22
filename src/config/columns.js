import { THUMB_COL_W } from '../utils/excelHelpers';

// ─── UI column definitions ────────────────────────────────────────────────────

export const YT_COLS = [
  { key: 'id',                  label: '',              type: 'thumbnail'                   },
  { key: 'title',               label: 'Título',        type: 'text',   truncate: true      },
  { key: 'channelName',         label: 'Canal',         type: 'text'                        },
  { key: 'viewCount',           label: 'Vistas',        type: 'number'                      },
  { key: 'likes',               label: 'Likes',         type: 'number'                      },
  { key: 'date',                label: 'Fecha',         type: 'date'                        },
  { key: 'duration',            label: 'Duración',      type: 'text'                        },
  { key: 'numberOfSubscribers', label: 'Suscriptores',  type: 'number'                      },
  { key: 'url',                 label: 'URL',           type: 'link'                        },
];

export const TT_COLS = [
  { key: 'videoMeta.coverUrl',  label: '',               type: 'tt-thumbnail', linkKey: 'webVideoUrl' },
  { key: 'authorMeta.name',     label: 'Usuario',        type: 'text'                                 },
  { key: 'text',                label: 'Texto',          type: 'text',         truncate: true         },
  { key: 'playCount',           label: 'Reproducciones', type: 'number'                               },
  { key: 'diggCount',           label: 'Likes',          type: 'number'                               },
  { key: 'shareCount',          label: 'Compartidos',    type: 'number'                               },
  { key: 'commentCount',        label: 'Comentarios',    type: 'number'                               },
  { key: 'collectCount',        label: 'Guardados',      type: 'number'                               },
  { key: 'videoMeta.duration',  label: 'Duración (s)',   type: 'text'                                 },
  { key: 'createTimeISO',       label: 'Fecha',          type: 'date'                                 },
  { key: 'webVideoUrl',         label: 'URL',            type: 'link'                                 },
];

export const FB_COLS = [
  { key: 'author.profile_picture_url', label: '',            type: 'fb-thumbnail', linkKey: 'author.profile_picture_url' },
  { key: 'author.name',           label: 'Autor',       type: 'fb-author',    linkKey: 'author.url' },
  { key: 'message',              label: 'Texto',       type: 'text',         truncate: true               },
  { key: 'reactions',             label: 'Reacciones',  type: 'reactions'                                  },
  { key: 'reactions_count',        label: 'Total',       type: 'number'                                     },
  { key: 'comments_count',         label: 'Comentarios', type: 'number'                                     },
  { key: 'timestamp',             label: 'Fecha',       type: 'date'                                       },
  { key: 'url',                   label: 'URL',         type: 'link'                                       },
];

export const IG_COLS = [
  { key: 'displayUrl',      label: '',            type: 'ig-thumbnail', linkKey: 'url' },
  { key: 'ownerUsername',   label: 'Usuario',     type: 'text' },
  { key: 'ownerFullName',   label: 'Nombre',      type: 'text' },
  { key: 'caption',         label: 'Caption',     type: 'text', truncate: true },
  { key: 'likesCount',      label: 'Likes',       type: 'number' },
  { key: 'commentsCount',   label: 'Comentarios', type: 'number' },
  { key: 'type',            label: 'Tipo',        type: 'text' },
  { key: 'locationName',    label: 'Ubicación',   type: 'text', truncate: true },
  { key: 'timestamp',       label: 'Fecha',       type: 'date' },
  { key: 'url',             label: 'URL',         type: 'link' },
];

export const GN_COLS = [
  { key: 'image',             label: 'Imagen',            type: 'news-thumbnail', linkKey: 'url' },
  { key: 'title',             label: 'Título',      type: 'text', truncate: true },
  { key: 'source',            label: 'Fuente',      type: 'text' },
  { key: 'description',       label: 'Descripción', type: 'text', truncate: true },
  { key: 'metadata.keyword',  label: 'Keyword',     type: 'text' },
  { key: 'metadata.timeframe',label: 'Timeframe',   type: 'text' },
  { key: 'publishedAt',       label: 'Fecha',       type: 'date' },
  { key: 'url',               label: 'URL',         type: 'link' },
];

// ─── Excel export column definitions ─────────────────────────────────────────

export const YT_EXCEL_COLS = [
  { header: 'Thumbnail',    key: 'thumb',        width: THUMB_COL_W, srcKey: null                  },
  { header: 'Título',       key: 'titulo',       width: 50,          srcKey: 'title'               },
  { header: 'Canal',        key: 'canal',        width: 22,          srcKey: 'channelName'         },
  { header: 'Vistas',       key: 'vistas',       width: 14,          srcKey: 'viewCount'           },
  { header: 'Likes',        key: 'likes',        width: 12,          srcKey: 'likes'               },
  { header: 'Fecha',        key: 'fecha',        width: 15,          srcKey: 'date'                },
  { header: 'Duración',     key: 'duracion',     width: 12,          srcKey: 'duration'            },
  { header: 'Suscriptores', key: 'suscriptores', width: 16,          srcKey: 'numberOfSubscribers' },
  { header: 'URL',          key: 'url',          width: 50,          srcKey: 'url'                 },
];

export const TT_EXCEL_COLS = [
  { header: 'Cover',          key: 'cover',          width: THUMB_COL_W, srcKey: null                 },
  { header: 'Usuario',        key: 'usuario',        width: 22,          srcKey: 'authorMeta.name'    },
  { header: 'Texto',          key: 'texto',          width: 50,          srcKey: 'text'               },
  { header: 'Reproducciones', key: 'reproducciones', width: 16,          srcKey: 'playCount'          },
  { header: 'Likes',          key: 'likes_tt',       width: 12,          srcKey: 'diggCount'          },
  { header: 'Compartidos',    key: 'compartidos',    width: 14,          srcKey: 'shareCount'         },
  { header: 'Comentarios',    key: 'comentarios',    width: 14,          srcKey: 'commentCount'       },
  { header: 'Guardados',      key: 'guardados',      width: 12,          srcKey: 'collectCount'       },
  { header: 'Duración (s)',   key: 'duracion',       width: 14,          srcKey: 'videoMeta.duration' },
  { header: 'Fecha',          key: 'fecha',          width: 20,          srcKey: 'createTimeISO'      },
  { header: 'URL',            key: 'url',            width: 50,          srcKey: 'webVideoUrl'        },
];

export const FB_EXCEL_COLS = [
  { header: 'Avatar',       key: 'avatar',      width: THUMB_COL_W, srcKey: null            },
  { header: 'Autor',        key: 'autor',       width: 25,          srcKey: 'author.name'   },
  { header: 'Texto',        key: 'texto',       width: 60,          srcKey: 'postText'      },
  {
    header: 'Reacciones', key: 'reacciones', width: 30, srcKey: 'reactions',
    transform: v => v && typeof v === 'object'
      ? Object.entries(v).filter(([, n]) => n > 0).map(([k, n]) => `${k}: ${n}`).join(', ')
      : (v || ''),
  },
  { header: 'Total React.', key: 'totalReact',  width: 13, srcKey: 'reactionsCount'                                              },
  { header: 'Comentarios',  key: 'comentarios', width: 14, srcKey: 'commentsCount'                                               },
  { header: 'Fecha',        key: 'fecha',       width: 20, srcKey: 'timestamp', transform: v => v ? new Date(Number(v)).toLocaleDateString('es') : '' },
  { header: 'URL',          key: 'url_fb',      width: 60, srcKey: 'url'                                                         },
];

export const IG_EXCEL_COLS = [
  { header: 'Preview',      key: 'preview',      width: THUMB_COL_W, srcKey: null },
  { header: 'Usuario',      key: 'usuario_ig',   width: 22,          srcKey: 'ownerUsername' },
  { header: 'Nombre',       key: 'nombre_ig',    width: 28,          srcKey: 'ownerFullName' },
  { header: 'Caption',      key: 'caption_ig',   width: 60,          srcKey: 'caption' },
  { header: 'Likes',        key: 'likes_ig',     width: 12,          srcKey: 'likesCount' },
  { header: 'Comentarios',  key: 'comentarios',  width: 14,          srcKey: 'commentsCount' },
  { header: 'Tipo',         key: 'tipo_ig',      width: 14,          srcKey: 'type' },
  { header: 'Ubicación',    key: 'ubicacion_ig', width: 30,          srcKey: 'locationName' },
  { header: 'Fecha',        key: 'fecha_ig',     width: 22,          srcKey: 'timestamp' },
  { header: 'URL',          key: 'url_ig',       width: 60,          srcKey: 'url' },
];

export const GN_EXCEL_COLS = [
  { header: 'Imagen',       key: 'imagen_gn',      width: THUMB_COL_W, srcKey: null },
  { header: 'Título',       key: 'titulo_gn',      width: 50,          srcKey: 'title' },
  { header: 'Fuente',       key: 'fuente_gn',      width: 24,          srcKey: 'source' },
  { header: 'Descripción',  key: 'descripcion_gn', width: 60,          srcKey: 'description' },
  { header: 'Keyword',      key: 'keyword_gn',     width: 20,          srcKey: 'metadata.keyword' },
  { header: 'Timeframe',    key: 'timeframe_gn',   width: 12,          srcKey: 'metadata.timeframe' },
  { header: 'Fecha',        key: 'fecha_gn',       width: 22,          srcKey: 'publishedAt' },
  { header: 'URL',          key: 'url_gn',         width: 60,          srcKey: 'url' },
];
