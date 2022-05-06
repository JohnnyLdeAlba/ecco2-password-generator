let index = 1000;

let THEME_DEFAULT = index++;
let THEME_VAPORWAVE = index++;
let THEME_THANOS = index++;
let THEME_NIGHT = index++;
let THEME_FIRE = index++;
let THEME_JURASSIC_BEACH = index++;
let THEME_THE_MACHINE = index++;
let THEME_THE_LAST_FIGHT = index++;

index = 2000;

let EFFECT_NONE = index++;
let EFFECT_TRANSPARENT = index++;
let EFFECT_RIPPLE = index++;
let EFFECT_REVERSE_RIPPLE = index++;
let EFFECT_DOUBLE_RIPPLE = index++;
let EFFECT_DOUBLE_WAVE = index++;
let EFFECT_WAVE = index++;
let EFFECT_WAVEX2 = index++;
let EFFECT_WAVEX4 = index++;
let EFFECT_WAVEX8 = index++;
let EFFECT_HALLUCINATION = index++;
let EFFECT_FLAMES = index++;
let EFFECT_REALITY_DISTORTION = index++;

index = 3000;

let RESOLUTION_ULTRA = index++;
let RESOLUTION_HIGH = index++;
let RESOLUTION_MEDIUM_HIGH = index++;
let RESOLUTION_MEDIUM = index++;
let RESOLUTION_LOW = index++;

function replace_char_at(string, char_index, replacement)
{
    return string.substring(0, char_index) + 
        replacement + string.substring(char_index + 1);
}

function char_filter_small(string, char_index)
{
    let table = [

	'\u0020', '\u9002',
	'\n', '\u9003',
	'A', '\u7000',
	'B', '\u7001',
	'C', '\u7002',
	'D', '\u7003', 
	'E', '\u7004', 
	'F', '\u7005', 
	'G', '\u7006', 
	'H', '\u7007', 
	'I', '\u7008', 
	'J', '\u7009', 
        'K', '\u7010', 
	'L', '\u7011', 
	'M', '\u7012',
	'N', '\u7013', 
	'O', '\u7014', 
	'P', '\u7015', 
	'Q', '\u7016', 
	'R', '\u7017', 
	'S', '\u7018', 
	'T', '\u7019', 
	'U', '\u7020', 
	'V', '\u7021', 
	'W', '\u7022', 
	'X', '\u7023',
	'Y', '\u7024', 
	'Z', '\u7025',
	'8', '\u7034',
        '.', '\u7041',
        ',', '\u7042',
        '*', '\u7047'
    ];

    let index = 0;
    let total = table.length/2;

    for (index = 0; index < total; index++)
        if (string.charAt(char_index) == table[(index * 2)])
            return replace_char_at(string, char_index, table[(index * 2) + 1]);

    return string;	
}

function char_filter_large(string, char_index)
{
    let table = [

	'\u0020', '\u9000',
	'\n', '\u9001'];

    let index = 0;
    let total = table.length/2;

    for (index = 0; index < total; index++)
        if (string.charAt(char_index) == table[(index * 2)])
            return replace_char_at(string, char_index, table[(index * 2) + 1]);

    return string;	
}

function text_filter_default(string)
{
    string = string.toUpperCase();

    let table = [

        // Russian Characters.

	/\u0410/g, 'A',
	/\u0412/g, 'B',
	/\u0415/g, 'E',

	/\u0417/g, '3',
	/\u041a/g, 'K',
	/\u041c/g, 'M',
	/\u041d/g, 'H',
	/\u041e/g, 'O',
	/\u0420/g, 'P',
	/\u0421/g, 'C',
	/\u0422/g, 'T',
        /\u0425/g, 'X',

        // Animated Characters.

	/\(1\)/g, '\u1001',
	/\(2\)/g, '\u1002',
	/\(3\)/g, '\u1003',
	/\(4\)/g, '\u1004',
	/\(5\)/g, '\u1005',
	/\(6\)/g, '\u1006',
	/\(7\)/g, '\u1007',
	/\(8\)/g, '\u1008',
	/\(9\)/g, '\u1009',

        // Character Modes.

        /\(L\)/g, '\u9900',
        /\(S\)/g, '\u9901'];

    let index = 0;
    let character = '';
    let mode = 0;

    for (index = 0; index < (table.length/2); index++)
        string = string.replace(table[index * 2], table[(index * 2) + 1]);

    for (index = 0; index < string.length; index++)
    {
        character = string.charAt(index);
        switch (character)
        { 
            case '\u9900': mode = 0; break;
            case '\u9901': mode = 1; break;
        }

        if (mode == 0)
           string = char_filter_large(string, index);
        else if (mode == 1)
           string = char_filter_small(string, index);
            
    }
 
    return string;
}

function get_theme_resource()
{
    let table = [

        THEME_DEFAULT,
        'font-000.png',
        'background-000.png',

        THEME_VAPORWAVE, 
        'font-001.png',
        'background-001.png',

        THEME_THANOS, 
        'font-000.png',
        'background-002.png',

        THEME_NIGHT, 
        'font-003.png',
        'background-003.png',

        THEME_FIRE, 
        'font-004.png',
        'background-004.png',

        THEME_JURASSIC_BEACH, 
        'font-005.png',
        'background-005.png',

        THEME_THE_MACHINE, 
        'font-007.png',
        'background-007.png',

        THEME_THE_LAST_FIGHT, 
        'font-006.png',
        'background-006.png' ];

    return table;
}

function get_effect_resource()
{
    let table = [

        EFFECT_NONE, 
        0,
        0,

        EFFECT_TRANSPARENT,
        0,
        0,

        EFFECT_RIPPLE, 
        SINEWAVE_TABLE_ID,
        RIPPLE_TABLE_ID,

        EFFECT_REVERSE_RIPPLE, 
        RIPPLE_TABLE_ID,
        SINEWAVE_TABLE_ID,

        EFFECT_DOUBLE_RIPPLE, 
        RIPPLE_TABLE_ID,
        RIPPLE_TABLE_ID,

        EFFECT_DOUBLE_WAVE, 
        SINEWAVE_TABLE_ID,
        SINEWAVE_TABLE_ID,

        EFFECT_WAVE, 
        SINEWAVE_TABLE_ID,
        1,

        EFFECT_WAVEX2, 
        SINEWAVE_TABLE_ID,
        2,

        EFFECT_WAVEX4, 
        SINEWAVE_TABLE_ID,
        4,

        EFFECT_WAVEX8, 
        SINEWAVE_TABLE_ID,
        8,

        EFFECT_HALLUCINATION, 
        SINEWAVE_TABLE_ID,
        -129,
 
        EFFECT_FLAMES,
        SINEWAVE_TABLE_ID,
        -130,

        EFFECT_REALITY_DISTORTION,
        SINEWAVE_TABLE_ID,
        -132 ];

    return table;
}

function filter_font_highlight(string)
{
    let table = [
        ' ', '\u9000',
        '\n', '\u9001',

        'a', '\u7300',
        'b', '\u7301',
        'c', '\u7302',
        'd', '\u7303',
        'e', '\u7304',
        'f', '\u7305',
        'g', '\u7306',
        'h', '\u7307',
        'i', '\u7308',
        'j', '\u7309',
        'k', '\u7310',
        'l', '\u7311',
        'm', '\u7312',
        'n', '\u7313',
        'o', '\u7314',
        'p', '\u7315',
        'q', '\u7316',
        'r', '\u7317',
        's', '\u7318',
        't', '\u7319',
        'u', '\u7320',
        'v', '\u7321',
        'w', '\u7322',
        'x', '\u7323',
        'y', '\u7324',
        'z', '\u7325',

        'A', '\u7300',
        'B', '\u7301',
        'C', '\u7302',
        'D', '\u7303',
        'E', '\u7304',
        'F', '\u7305',
        'G', '\u7306',
        'H', '\u7307',
        'I', '\u7308',
        'J', '\u7309',
        'K', '\u7310',
        'L', '\u7311',
        'M', '\u7312',
        'N', '\u7313',
        'O', '\u7314',
        'P', '\u7315',
        'Q', '\u7316',
        'R', '\u7317',
        'S', '\u7318',
        'T', '\u7319',
        'U', '\u7320',
        'V', '\u7321',
        'W', '\u7322',
        'X', '\u7323',
        'Y', '\u7324',
        'Z', '\u7325',

        '0', '\u7326',
        '1', '\u7327',
        '2', '\u7328',
        '3', '\u7329',
        '4', '\u7330',
        '5', '\u7331',
        '6', '\u7332',
        '7', '\u7333',
        '8', '\u7334',
        '9', '\u7335',

        '!', '',
        '', '',
        '?', '',
        '', '',
        ',', '\u7340',
        '.', '\u7341',
        '\'', '\u7342',
        '\{', '\u7343',
        '\}', '\u7344',
        ';', '\u7345',
        ':', '\u7346',
        '-', '\u7347'
    ];

    let x = 0, y = 0;

    string = string.toString();

    for (x = 0; x < string.length; x++)
        for (y = 0; y < table.length/2; y++)
            if (string.charAt(x) == table[(y * 2)])
                string = replace_char_at(string, x, table[(y * 2) + 1]);

    return string;
}

function filter_font_white(string)
{
    let table = [
        ' ', '\u9002',
        '\n', '\u9003',

        'a', '\u7000',
        'b', '\u7001',
        'c', '\u7002',
        'd', '\u7003',
        'e', '\u7004',
        'f', '\u7005',
        'g', '\u7006',
        'h', '\u7007',
        'i', '\u7008',
        'j', '\u7009',
        'k', '\u7010',
        'l', '\u7011',
        'm', '\u7012',
        'n', '\u7013',
        'o', '\u7014',
        'p', '\u7015',
        'q', '\u7016',
        'r', '\u7017',
        's', '\u7018',
        't', '\u7019',
        'u', '\u7020',
        'v', '\u7021',
        'w', '\u7022',
        'x', '\u7023',
        'y', '\u7024',
        'z', '\u7025',

        'A', '\u7000',
        'B', '\u7001',
        'C', '\u7002',
        'D', '\u7003',
        'E', '\u7004',
        'F', '\u7005',
        'G', '\u7006',
        'H', '\u7007',
        'I', '\u7008',
        'J', '\u7009',
        'K', '\u7010',
        'L', '\u7011',
        'M', '\u7012',
        'N', '\u7013',
        'O', '\u7014',
        'P', '\u7015',
        'Q', '\u7016',
        'R', '\u7017',
        'S', '\u7018',
        'T', '\u7019',
        'U', '\u7020',
        'V', '\u7021',
        'W', '\u7022',
        'X', '\u7023',
        'Y', '\u7024',
        'Z', '\u7025',

        '0', '\u7026',
        '1', '\u7027',
        '2', '\u7028',
        '3', '\u7029',
        '4', '\u7030',
        '5', '\u7031',
        '6', '\u7032',
        '7', '\u7033',
        '8', '\u7034',
        '9', '\u7035',
        '', '',
        '', '',
        '', '',
        '', '',
        ',', '\u7040',
        '.', '\u7041',
        '\'', '\u7042',
        '\{', '\u7043',
        '\}', '\u7044',
        ';', '\u7045',
        ':', '\u7046',
        '*', '\u7047'
    ];

    let x = 0, y = 0;

    for (x = 0; x < string.length; x++)
        for (y = 0; y < table.length/2; y++)
            if (string.charAt(x) == table[(y * 2)])
                string = replace_char_at(string, x, table[(y * 2) + 1]);

    return string;
}

function filter_font_yellow(string)
{
    let table = [
        ' ', '\u9002',
        '\n', '\u9003',

        'a', '\u7100',
        'b', '\u7101',
        'c', '\u7102',
        'd', '\u7103',
        'e', '\u7104',
        'f', '\u7105',
        'g', '\u7106',
        'h', '\u7107',
        'i', '\u7108',
        'j', '\u7109',
        'k', '\u7110',
        'l', '\u7111',
        'm', '\u7112',
        'n', '\u7113',
        'o', '\u7114',
        'p', '\u7115',
        'q', '\u7116',
        'r', '\u7117',
        's', '\u7118',
        't', '\u7119',
        'u', '\u7120',
        'v', '\u7121',
        'w', '\u7122',
        'x', '\u7123',
        'y', '\u7124',
        'z', '\u7125',

        'A', '\u7100',
        'B', '\u7101',
        'C', '\u7102',
        'D', '\u7103',
        'E', '\u7104',
        'F', '\u7105',
        'G', '\u7106',
        'H', '\u7107',
        'I', '\u7108',
        'J', '\u7109',
        'K', '\u7110',
        'L', '\u7111',
        'M', '\u7112',
        'N', '\u7113',
        'O', '\u7114',
        'P', '\u7115',
        'Q', '\u7116',
        'R', '\u7117',
        'S', '\u7118',
        'T', '\u7119',
        'U', '\u7120',
        'V', '\u7121',
        'W', '\u7122',
        'X', '\u7123',
        'Y', '\u7124',
        'Z', '\u7125',

        '0', '\u7126',
        '1', '\u7127',
        '2', '\u7128',
        '3', '\u7129',
        '4', '\u7130',
        '5', '\u7131',
        '6', '\u7132',
        '7', '\u7133',
        '8', '\u7134',
        '9', '\u7135',
        '', '\u7136',
        '', '\u7137',
        '', '\u7138',
        '', '\u7139',
        ',', '\u7140',
        '.', '\u7141',
        '\'', '\u7142',
        '\{', '\u7143',
        '\}', '\u7144',
        ';', '\u7145',
        ':', '\u7146',
        '*', '\u7147',
    ];

    let x = 0, y = 0;

    for (x = 0; x < string.length; x++)
        for (y = 0; y < table.length/2; y++)
            if (string.charAt(x) == table[(y * 2)])
                string = replace_char_at(string, x, table[(y * 2) + 1]);

    return string;
}

function filter_font_red(string)
{
    let table = [
        ' ', '\u9002',
        '\n', '\u9003',
        'a', '\u7200',
        'b', '\u7201',
        'c', '\u7202',
        'd', '\u7203',
        'e', '\u7204',
        'f', '\u7205',
        'g', '\u7206',
        'h', '\u7207',
        'i', '\u7208',
        'j', '\u7209',
        'k', '\u7210',
        'l', '\u7211',
        'm', '\u7212',
        'n', '\u7213',
        'o', '\u7214',
        'p', '\u7215',
        'q', '\u7216',
        'r', '\u7217',
        's', '\u7218',
        't', '\u7219',
        'u', '\u7220',
        'v', '\u7221',
        'w', '\u7222',
        'x', '\u7223',
        'y', '\u7224',
        'z', '\u7225',

        'A', '\u7200',
        'B', '\u7201',
        'C', '\u7202',
        'D', '\u7203',
        'E', '\u7204',
        'F', '\u7205',
        'G', '\u7206',
        'H', '\u7207',
        'I', '\u7208',
        'J', '\u7209',
        'K', '\u7210',
        'L', '\u7211',
        'M', '\u7212',
        'N', '\u7213',
        'O', '\u7214',
        'P', '\u7215',
        'Q', '\u7216',
        'R', '\u7217',
        'S', '\u7218',
        'T', '\u7219',
        'U', '\u7220',
        'V', '\u7221',
        'W', '\u7222',
        'X', '\u7223',
        'Y', '\u7224',
        'Z', '\u7225',

        '0', '\u7226',
        '1', '\u7227',
        '2', '\u7228',
        '3', '\u7229',
        '4', '\u7230',
        '5', '\u7231',
        '6', '\u7232',
        '7', '\u7233',
        '8', '\u7234',
        '9', '\u7235',
        '', '',
        '', '',
        '', '',
        '', '',
        ',', '\u7240',
        '.', '\u7241',
        '\'', '\u7242',
        '\{', '\u7243',
        '\}', '\u7244',
        ';', '\u7245',
        ':', '\u7246',
        '*', '\u7247'
    ];

    let x = 0, y = 0;

    for (x = 0; x < string.length; x++)
        for (y = 0; y < table.length/2; y++)
            if (string.charAt(x) == table[(y * 2)])
                string = replace_char_at(string, x, table[(y * 2) + 1]);

    return string;
}

let _white = filter_font_white;
let _yellow = filter_font_yellow;
let _red = filter_font_red;

function get_font_resource() {

   let table = [
        '\u8000', -4, 0, 0,
        '\u8001', -5, 0, 0,
        '\u8002', -6, 0, 0,
        '\u9000', -2, 16, 29,
        '\u9001', -3, 0, 29,

        // Alphabit
        'A', 0, 16, 29,
        'B', 0, 16, 29,
        'C', 0, 16, 29,
        'D', 0, 16, 29,
        'E', 0, 16, 29,
        'F', 0, 15, 29,
        'G', 0, 16, 29,
        'H', 0, 16, 29,
        'I', 0,  8, 29,
        'J', 0, 16, 29,
        'K', 0, 16, 29,
        'L', 0, 16, 29,
        'M', 0, 24, 29,
        'N', 0, 16, 29,
        'O', 0, 16, 29,
        'P', 0, 16, 29,
        'Q', 0, 16, 29,
        'R', 0, 16, 29,
        'S', 0, 16, 29,
        'T', 0, 16, 29,
        'U', 0, 16, 29,
        'V', 0, 16, 29,
        'W', 0, 24, 29,
        'X', 0, 18, 29,
        'Y', 0, 16, 29,
        'Z', 0, 16, 29,

        // Extended
	'À', 0, 16, 29,
        'È', 0, 16, 29,
        'Ì', 0,  8, 29,
        'Ò', 0, 16, 29,
        'Ù', 0, 16, 29,
        'Á', 0, 16, 29,
        'É', 0, 16, 29,
        'Í', 0,  8, 29,
        'Ó', 0, 16, 29,
        'Ú', 0, 16, 29,
        'Ȁ', 0, 16, 29,
        'Ȅ', 0, 16, 29,
        'Ȉ', 0, 14, 29,
        'Ȍ', 0, 16, 29,
        'Ȕ', 0, 16, 29,
        'Ä', 0, 16, 29,
        'Ë', 0, 16, 29,
        'Ï', 0, 13, 29,
        'Ö', 0, 16, 29,
        'Ü', 0, 16, 29,
        'Ã', 0, 16, 29,
        'Ẽ', 0, 16, 29,
        'Ĩ', 0, 10, 29,
        'Õ', 0, 16, 29,
        'Ũ', 0, 16, 29,
        '\u00d1', 0, 16, 29,
        'Â', 0, 16, 29,
        'Ê', 0, 16, 29,
        'Î', 0, 10, 29,
        'Ô', 0, 16, 29,
        'Û', 0, 16, 29,
        '\u00c7', 0, 16, 29,
        'Ð', 0, 19, 29,
        'Þ', 0, 16, 29,
        'Æ', 0, 23, 29,

        // Russian
        'Б', 0, 16, 29,
        'Г', 0, 15, 29,
        'Д', 0, 16, 29,
        'Ж', 0, 23, 29,
        'И', 0, 16, 29,
        'Й', 0, 16, 29,
        'Л', 0, 16, 29,
        'П', 0, 16, 29,
	'У', 0, 16, 29,
        'Ф', 0, 21, 29,
        'Ч', 0, 16, 29,
        'Ш', 0, 21, 29,
        'Щ', 0, 22, 29,
        'Ъ', 0, 21, 29,
        'Ы', 0, 22, 29,
        'Ь', 0, 16, 29,
        'Э', 0, 16, 29,
	'Ю', 0, 22, 29,
        'Я', 0, 16, 29,

        // Numbers
        '0', 0, 15, 29,
        '1', 0, 11, 29,
        '2', 0, 16, 29,
        '3', 0, 16, 29,
        '4', 0, 16, 29,
        '5', 0, 16, 29,
        '6', 0, 16, 29,
        '7', 0, 16, 29,
        '8', 0, 16, 29,
        '9', 0, 16, 29,

        // Punctuation
        '!', 0,  7, 29,
        '¡', 0,  7, 29,
        '?', 0, 16, 29,
        '¿', 0, 16, 29,
        ',', 0,  8, 29,
        '.', 0,  7, 29,
        "'", 0,  8, 29,
	'{', 0, 13, 29,
	'}', 0, 13, 29,
        ';', 0,  7, 29,
        ':', 0,  7, 29,
        '-', 0, 16, 29,
	
        // Highlighted

        '\u7300', 0, 16, 29,
        '\u7301', 0, 16, 29,
        '\u7302', 0, 16, 29,
        '\u7303', 0, 16, 29,
        '\u7304', 0, 16, 29,
        '\u7305', 0, 15, 29,
        '\u7306', 0, 16, 29,
        '\u7307', 0, 16, 29,
        '\u7308', 0,  8, 29,
        '\u7309', 0, 16, 29,
        '\u7310', 0, 16, 29,
        '\u7311', 0, 16, 29,
        '\u7312', 0, 24, 29,
        '\u7313', 0, 16, 29,
        '\u7314', 0, 16, 29,
        '\u7315', 0, 16, 29,
        '\u7316', 0, 16, 29,
        '\u7317', 0, 16, 29,
        '\u7318', 0, 16, 29,
        '\u7319', 0, 16, 29,
        '\u7320', 0, 16, 29,
        '\u7321', 0, 16, 29,
        '\u7322', 0, 24, 29,
        '\u7323', 0, 18, 29,
        '\u7324', 0, 16, 29,
        '\u7325', 0, 16, 29,

        '\u7326', 0, 15, 29,
        '\u7327', 0, 11, 29,
        '\u7328', 0, 16, 29,
        '\u7329', 0, 16, 29,
        '\u7330', 0, 16, 29,
        '\u7331', 0, 16, 29,
        '\u7332', 0, 16, 29,
        '\u7333', 0, 16, 29,
        '\u7334', 0, 16, 29,
        '\u7335', 0, 16, 29,

        '\u7336', 0,  7, 29,
        '\u7337', 0,  7, 29,
        '\u7338', 0, 16, 29,
        '\u7339', 0, 16, 29,
        '\u7340', 0,  8, 29,
        '\u7341', 0,  7, 29,
        '\u7342', 0,  8, 29,
	'\u7343', 0, 13, 29,
	'\u7344', 0, 13, 29,
        '\u7345', 0,  7, 29,
        '\u7346', 0,  7, 29,
        '\u7347', 0, 16, 29,
	
	// Hiragana
        '\u3042', 0, 17, 29,
        '\u304b', 0, 17, 29,
        '\u305f', 0, 17, 29,
        '\u306a', 0, 18, 29,
        '\u306f', 0, 17, 29,
        '\u307e', 0, 15, 29,
        '\u3084', 0, 17, 29,
        '\u3089', 0, 16, 29,
        '\u308f', 0, 17, 29,
        '\u3044', 0, 16, 29,
        '\u304d', 0, 17, 29,
        '\u3057', 0, 16, 29,
        '\u3061', 0, 17, 29,
        '\u306b', 0, 16, 29,
        '\u3072', 0, 17, 29,
        '\u307f', 0, 18, 29,
        '\u308a', 0, 15, 29,
        '\u3046', 0, 13, 29,
        '\u304f', 0, 13, 29,
        '\u3059', 0, 17, 29,
        '\u3064', 0, 17, 29,
        '\u3075', 0, 17, 29,
        '\u3080', 0, 17, 29,
        '\u3086', 0, 14, 29,
        '\u308b', 0, 16, 29,
        '\u3048', 0, 17, 29,
        '\u3051', 0, 17, 29,
        '\u305b', 0, 17, 29,
        '\u3066', 0, 17, 29,
        '\u306d', 0, 17, 29,
        '\u3078', 0, 17, 29,
        '\u3081', 0, 17, 29,
        '\u308c', 0, 17, 29,
        '\u304a', 0, 17, 29,
        '\u3053', 0, 16, 29,
        '\u305d', 0, 17, 29,
        '\u3068', 0, 15, 29,
        '\u306e', 0, 17, 29,
        '\u307b', 0, 18, 29,
        '\u3082', 0, 16, 29,
        '\u3088', 0, 15, 29,
        '\u3092', 0, 17, 29,
        '\u3093', 0, 17, 29,
        '\u308d', 0, 16, 29,

        // Katakana
        '\u30a2', 0, 17, 29,
        '\u30ab', 0, 17, 29,
        '\u30b5', 0, 17, 29,
        '\u30bf', 0, 16, 29,
        '\u30ca', 0, 17, 29,
        '\u30cf', 0, 18, 29,
        '\u30de', 0, 16, 29,
        '\u30e4', 0, 16, 29,
        '\u30e9', 0, 16, 29,
        '\u30ef', 0, 16, 29,
        '\u30f3', 0, 17, 29,
        '\u30a4', 0, 16, 29,
        '\u30ad', 0, 17, 29,
        '\u30b7', 0, 17, 29,
        '\u30c1', 0, 17, 29,
        '\u30cb', 0, 17, 29,
        '\u30d2', 0, 16, 29,
        '\u30df', 0, 12, 29,
        '\u30ea', 0, 12, 29,
        '\u30a6', 0, 17, 29,
        '\u30af', 0, 17, 29,
        '\u30b9', 0, 17, 29,
        '\u30c4', 0, 14, 29,
        '\u30cc', 0, 16, 29,
        '\u30d5', 0, 16, 29,
        '\u30e0', 0, 17, 29,
        '\u30e6', 0, 18, 29,
        '\u30eb', 0, 18, 29,
        '\u30a8', 0, 18, 29,
        '\u30b1', 0, 17, 29,
        '\u30bb', 0, 17, 29,
        '\u30c6', 0, 17, 29,
        '\u30cd', 0, 17, 29,
        '\u30d8', 0, 17, 29,
        '\u30e1', 0, 15, 29,
        '\u30ec', 0, 14, 29,
        '\u30aa', 0, 17, 29,
        '\u30b3', 0, 16, 29,
        '\u30bd', 0, 17, 29,
        '\u30c8', 0, 13, 29,
        '\u30ce', 0, 14, 29,
        '\u30db', 0, 17, 29,
        '\u30e2', 0, 17, 29,
        '\u30e8', 0, 16, 29,
        '\u30ed', 0, 16, 29,
        '\u30f2', 0, 16, 29,

        // Small Characters
        '\u9002', -2, 8, 14,
        '\u9003', -3, 0, 14,

        '\u7000', 0, 8, 14,
        '\u7001', 0, 8, 14,
        '\u7002', 0, 8, 14,
        '\u7003', 0, 8, 14,
        '\u7004', 0, 8, 14,
        '\u7005', 0, 8, 14,
        '\u7006', 0, 8, 14,
        '\u7007', 0, 8, 14,
        '\u7008', 0, 8, 14,
        '\u7009', 0, 8, 14,
        '\u7010', 0, 8, 14,
        '\u7011', 0, 8, 14,
        '\u7012', 0, 8, 14,
        '\u7013', 0, 8, 14,
        '\u7014', 0, 8, 14,
        '\u7015', 0, 8, 14,
        '\u7016', 0, 8, 14,
        '\u7017', 0, 8, 14,
        '\u7018', 0, 8, 14,
        '\u7019', 0, 8, 14,
        '\u7020', 0, 8, 14,
        '\u7021', 0, 8, 14,
        '\u7022', 0, 8, 14,
        '\u7023', 0, 8, 14,
        '\u7024', 0, 8, 14,
        '\u7025', 0, 8, 14,
        '\u7026', 0, 8, 14,
        '\u7027', 0, 8, 14,
        '\u7028', 0, 8, 14,
        '\u7029', 0, 8, 14,
        '\u7030', 0, 8, 14,
        '\u7031', 0, 8, 14,
        '\u7032', 0, 8, 14,
        '\u7033', 0, 8, 14,
        '\u7034', 0, 8, 14,
        '\u7035', 0, 8, 14,
        '\u7036', 0, 8, 14,
        '\u7037', 0, 8, 14,
        '\u7038', 0, 8, 14,
        '\u7039', 0, 8, 14,
        '\u7040', 0, 8, 14,
        '\u7041', 0, 8, 14,
        '\u7042', 0, 8, 14,
        '\u7043', 0, 8, 14,
        '\u7044', 0, 8, 14,
        '\u7045', 0, 8, 14,
        '\u7046', 0, 8, 14,
        '\u7047', 0, 8, 14,
        '\u7048', 0, 8, 14,

        '\u7100', 0, 8, 14,
        '\u7101', 0, 8, 14,
        '\u7102', 0, 8, 14,
        '\u7103', 0, 8, 14,
        '\u7104', 0, 8, 14,
        '\u7105', 0, 8, 14,
        '\u7106', 0, 8, 14,
        '\u7107', 0, 8, 14,
        '\u7108', 0, 8, 14,
        '\u7109', 0, 8, 14,
        '\u7110', 0, 8, 14,
        '\u7111', 0, 8, 14,
        '\u7112', 0, 8, 14,
        '\u7113', 0, 8, 14,
        '\u7114', 0, 8, 14,
        '\u7115', 0, 8, 14,
        '\u7116', 0, 8, 14,
        '\u7117', 0, 8, 14,
        '\u7118', 0, 8, 14,
        '\u7119', 0, 8, 14,
        '\u7120', 0, 8, 14,
        '\u7121', 0, 8, 14,
        '\u7122', 0, 8, 14,
        '\u7123', 0, 8, 14,
        '\u7124', 0, 8, 14,
        '\u7125', 0, 8, 14,
        '\u7126', 0, 8, 14,
        '\u7127', 0, 8, 14,
        '\u7128', 0, 8, 14,
        '\u7129', 0, 8, 14,
        '\u7130', 0, 8, 14,
        '\u7131', 0, 8, 14,
        '\u7132', 0, 8, 14,
        '\u7133', 0, 8, 14,
        '\u7134', 0, 8, 14,
        '\u7135', 0, 8, 14,
        '\u7136', 0, 8, 14,
        '\u7137', 0, 8, 14,
        '\u7138', 0, 8, 14,
        '\u7139', 0, 8, 14,
        '\u7140', 0, 8, 14,
        '\u7141', 0, 8, 14,
        '\u7142', 0, 8, 14,
        '\u7143', 0, 8, 14,
        '\u7144', 0, 8, 14,
        '\u7145', 0, 8, 14,
        '\u7146', 0, 8, 14,
        '\u7147', 0, 8, 14,
        '\u7148', 0, 8, 14,

        '\u7200', 0, 8, 14,
        '\u7201', 0, 8, 14,
        '\u7202', 0, 8, 14,
        '\u7203', 0, 8, 14,
        '\u7204', 0, 8, 14,
        '\u7205', 0, 8, 14,
        '\u7206', 0, 8, 14,
        '\u7207', 0, 8, 14,
        '\u7208', 0, 8, 14,
        '\u7209', 0, 8, 14,
        '\u7210', 0, 8, 14,
        '\u7211', 0, 8, 14,
        '\u7212', 0, 8, 14,
        '\u7213', 0, 8, 14,
        '\u7214', 0, 8, 14,
        '\u7215', 0, 8, 14,
        '\u7216', 0, 8, 14,
        '\u7217', 0, 8, 14,
        '\u7218', 0, 8, 14,
        '\u7219', 0, 8, 14,
        '\u7220', 0, 8, 14,
        '\u7221', 0, 8, 14,
        '\u7222', 0, 8, 14,
        '\u7223', 0, 8, 14,
        '\u7224', 0, 8, 14,
        '\u7225', 0, 8, 14,
        '\u7226', 0, 8, 14,
        '\u7227', 0, 8, 14,
        '\u7228', 0, 8, 14,
        '\u7229', 0, 8, 14,
        '\u7230', 0, 8, 14,
        '\u7231', 0, 8, 14,
        '\u7232', 0, 8, 14,
        '\u7233', 0, 8, 14,
        '\u7234', 0, 8, 14,
        '\u7235', 0, 8, 14,
        '\u7236', 0, 8, 14,
        '\u7237', 0, 8, 14,
        '\u7238', 0, 8, 14,
        '\u7239', 0, 8, 14,
        '\u7240', 0, 8, 14,
        '\u7241', 0, 8, 14,
        '\u7242', 0, 8, 14,
        '\u7243', 0, 8, 14,
        '\u7244', 0, 8, 14,
        '\u7245', 0, 8, 14,
        '\u7246', 0, 8, 14,
        '\u7247', 0, 8, 14,
        '\u7248', 0, 8, 14,

        // Animated Characters
	'\u1001', 0,  24, 32,
	'\u1002', 0,  37, 49,
	'\u1003', 0,  32, 32,
        '\u1004', 0,  43, 41,
	'\u1005', 0,  24, 30,
        '\u1006', 0,  32, 25,
	'\u1007', 0,  47, 19,
	'\u1008', 0,  75, 27,
        '\u1009', 0, 103, 29 ];

    return table;
}

function get_clip_resource()
{
    let table = [
        5, 0, 1, 2, 3, 4,
           2, 2, 3, 2, 2,

        5, 0, 1, 2, 3, 4,
           7, 5, 5, 5, 5,

        4, 0, 1, 2, 3,
           3, 3, 3, 3,

        5, 0, 1, 2, 3, 4,
           2, 2, 3, 2, 2,

        6, 0, 1, 2, 3, 4, 5,
           1, 1, 1, 1, 3, 3,

        3, 0, 1, 2,
           4, 4, 5,

        4, 0, 1, 2, 3,
           7, 7, 7, 7,

        6, 0, 1, 2, 3, 4, 5,
           2, 2, 3, 3, 3, 3,

        24, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 4, 5, 6, 7, 6, 7, 6, 7, 5, 3, 1,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2  ];

    return table;
}

function get_clip_total(ClipResource)
{
    let index = 0;
    let total = 0;

    for (; index < ClipResource.length; index++)
    {
        index+= ClipResource[index] * 2;
        total++;
    }

    return total;
}

function create_default_h_config()
{
    var cfg = new t_config();

    cfg.FRAME_SKIP = 1;
    cfg.ANIMATION_DELAY = 20 * cfg.FRAME_SKIP;

    cfg.IMAGE_WIDTH = 320;
    cfg.IMAGE_HEIGHT = 240;

    cfg.SCALE = 1;
    cfg.EFFECT = EFFECT_RIPPLE;
    cfg.THEME = THEME_DEFAULT;

    cfg.RESOURCES_DIR = 'resources/';
    cfg.RESOURCE_FORMAT = 'png';
    cfg.BACKGROUND_TOTAL = Math.floor(256 / cfg.FRAME_SKIP);

    cfg.RESOURCE_TOTAL = cfg.BACKGROUND_TOTAL + 1;

    cfg.BACKGROUND_FILENAME = 'background-000.png';
    cfg.FONT_FILENAME = 'font-000.png';
    cfg.CLIP_FILENAME = 'clip-0428.png';

    cfg.CHARACTER_WIDTH = 0;
    cfg.CHARACTER_HEIGHT = 0;
    cfg.CHARACTER_SPACING = 0;

    cfg.CLIP_OFFSET = 198;

    cfg.PADDING = 8;
    cfg.LINE_SPACING = 0;

    cfg.FontResource = get_font_resource();
    cfg.ClipResource = get_clip_resource(); 
    cfg.ThemeResource = get_theme_resource();
    cfg.EffectResource = get_effect_resource();

    cfg.CHARACTER_TOTAL = cfg.FontResource.length / 4;
    cfg.CLIP_TOTAL = get_clip_total(cfg.ClipResource);

    cfg.CLIP_OFFSET = cfg.CHARACTER_TOTAL - cfg.CLIP_TOTAL;

    return cfg;
}
