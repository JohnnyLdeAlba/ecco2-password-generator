/*
 *  MIT License
 *
 *  Reverse Engineered by Johnny L. de Alba (Arkonviox), 2020
 *  Copyright (c) 2020. Novotrade International and Sega Games Co., Ltd.
 *
 *  Permission is hereby granted, free of charge, to any person 
 *  obtaining a copy of this software and associated documentation 
 *  files (the "Software"), to deal in the Software without 
 *  restriction, including without limitation the rights to use, 
 *  copy, modify, merge, publish, distribute, sublicense, and/or 
 *  sell copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following 
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the 
 *  Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY 
 *  KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
 *  WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 *  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
 *  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 *  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 *  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  Project Nautilus 
 *
 *  Ecco Wave Generating Algorythm
 *  Version: 1.00.02142020
 *
 *  Game: Ecco 2: The Tides of Time, Europe (PAL)
 *  Platform: Sega Genesis/Mega Drive
 *  ROM Address: 0x0bb006
 *
 *  Summary: The ripple/wave generating algorythm from Ecco 2: The Tides of Time.
 *
 */

function t_machine_state()
{
    this.pc = 0;
    this.a = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
    this.d = [ 0, 0, 0, 0, 0, 0, 0, 0 ];

    this.memory = null;
}

function hbyte(x) { return (x & 0x0000ff00); }
function lbyte(x) { return (x & 0x000000ff); }
function _byte(x) { return lbyte(x); }

function hword(x) { return (x & 0xffff0000); }
function lword(x) { return (x & 0x0000ffff); }
function _word(x) { return lword(x); }

function moveb(y, x) { return (hword(x) | lword(hbyte(x) | lbyte(y))); }

function clrw(x) { return lword(x); }
function movew(y, x) { return (hword(x) | lword(y)); }
function addw(y, x) { return movew(x + y, x); }
function subw(y, x) { return movew(x - y, x); }
function lslw(y, x) { return movew(x << y, x); }
function lsrw(y, x) { return movew(x >> y, x); }
function andw(y, x) { return movew(x & y, x); }
function orw(y, x) { return movew(x | y, x); }

function movel(y, x) { return y; }
function addl(y, x) { return movel(x + y, x); }
function orl(y, x) { return movel(x | y, x); }

function asrw(y, x)
{
    if (x & 0x8000)
    {
	x = 0xffff0000 | x;
	return _word(x >> y);
    }

    return lsrw(y, x);
}

function extw(x)
{
    x = lbyte(x);
    if (x & 0x0080) x = orw(0xff00, x);
    return x;
}

function extl(x)
{
    x = lword(x);
    if (x & 0x8000) x = orl(0xffff0000, x);
    return x;
}

let _0x002cc8 = 0;        // (a2) Primary Table (Sine Wave Table).
let _0xfff962 = 256;      // (a4) Secondary Table.
let _0xfffcbf = 2048 - 1; // (a3) Pointer to the Frame Index.
let _0xffedf8 = 1024;     // (a5) Offset Table.

let PRIMARY_TABLE_ID = -999;
let SINE_WAVE_TABLE = [

    0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x3f, 0x3f,
    0x3f, 0x3e, 0x3e, 0x3e, 0x3d, 0x3d, 0x3c, 0x3c,
    0x3b, 0x3b, 0x3a, 0x39, 0x38, 0x38, 0x37, 0x36,
    0x35, 0x34, 0x33, 0x32, 0x31, 0x30, 0x2f, 0x2e,
    0x2d, 0x2c, 0x2b, 0x2a, 0x29, 0x27, 0x26, 0x25,
    0x24, 0x22, 0x21, 0x20, 0x1e, 0x1d, 0x1b, 0x1a,
    0x18, 0x17, 0x16, 0x14, 0x13, 0x11, 0x10, 0x0e,
    0x0c, 0x0b, 0x09, 0x08, 0x06, 0x05, 0x03, 0x02,
    0x00, 0xfe, 0xfd, 0xfb, 0xfa, 0xf8, 0xf7, 0xf5,
    0xf4, 0xf2, 0xf0, 0xef, 0xed, 0xec, 0xea, 0xe9,
    0xe8, 0xe6, 0xe5, 0xe3, 0xe2, 0xe0, 0xdf, 0xde,
    0xdc, 0xdb, 0xda, 0xd9, 0xd7, 0xd6, 0xd5, 0xd4,
    0xd3, 0xd2, 0xd1, 0xd0, 0xcf, 0xce, 0xcd, 0xcc,
    0xcb, 0xca, 0xc9, 0xc8, 0xc8, 0xc7, 0xc6, 0xc5,
    0xc5, 0xc4, 0xc4, 0xc3, 0xc3, 0xc2, 0xc2, 0xc2,
    0xc1, 0xc1, 0xc1, 0xc0, 0xc0, 0xc0, 0xc0, 0xc0,
    0xc0, 0xc0, 0xc0, 0xc0, 0xc0, 0xc0, 0xc1, 0xc1,
    0xc1, 0xc2, 0xc2, 0xc2, 0xc3, 0xc3, 0xc4, 0xc4,
    0xc5, 0xc5, 0xc6, 0xc7, 0xc8, 0xc8, 0xc9, 0xca,
    0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2,
    0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd9, 0xda, 0xdb,
    0xdc, 0xde, 0xdf, 0xe0, 0xe2, 0xe3, 0xe5, 0xe6,
    0xe8, 0xe9, 0xea, 0xec, 0xed, 0xef, 0xf0, 0xf2,
    0xf4, 0xf5, 0xf7, 0xf8, 0xfa, 0xfb, 0xfd, 0xfe,
    0x00, 0x02, 0x03, 0x05, 0x06, 0x08, 0x09, 0x0b,
    0x0c, 0x0e, 0x10, 0x11, 0x13, 0x14, 0x16, 0x17,
    0x18, 0x1a, 0x1b, 0x1d, 0x1e, 0x20, 0x21, 0x22,
    0x24, 0x25, 0x26, 0x27, 0x29, 0x2a, 0x2b, 0x2c,
    0x2d, 0x2e, 0x2f, 0x30, 0x31, 0x32, 0x33, 0x34,
    0x35, 0x36, 0x37, 0x38, 0x38, 0x39, 0x3a, 0x3b,
    0x3b, 0x3c, 0x3c, 0x3d, 0x3d, 0x3e, 0x3e, 0x3e,
    0x3f, 0x3f, 0x3f, 0x40, 0x40, 0x40, 0x40, 0x40,
    0x40 ];

let SECONDARY_TABLE_ID = -998;
let SECONDARY_TABLE = [

    0xe5, 0x72, 0xb9, 0xdc, 0xee, 0x77, 0x3b, 0x1d,
    0x0e, 0x87, 0xc3, 0xe1, 0x70, 0xb8, 0xdc, 0xee,
    0xf7, 0x7b, 0x3d, 0x9e, 0x4f, 0xa7, 0x53, 0x29,
    0x94, 0xca, 0xe5, 0x72, 0x39, 0x9c, 0xce, 0xe7,
    0xf3, 0xf9, 0xfc, 0xfe, 0xff, 0xff, 0x7f, 0x3f,
    0x9f, 0x4f, 0xa7, 0xd3, 0xe9, 0x74, 0x3a, 0x1d,
    0x0e, 0x87, 0xc3, 0xe1, 0xf0, 0xf8, 0x7c, 0x3e,
    0x9f, 0x4f, 0x27, 0x93, 0x49, 0xa4, 0x52, 0xa9,
    0xd4, 0xea, 0xf5, 0xfa, 0xfd, 0x7e, 0x3f, 0x1f,
    0x8f, 0xc7, 0x63, 0xb1, 0x58, 0x2c, 0x96, 0x4b,
    0xa5, 0xd2, 0x69, 0x34, 0x1a, 0x8d, 0xc6, 0xe3,
    0x71, 0xb8, 0x5c, 0xae, 0x57, 0xab, 0xd5, 0xea,
    0x75, 0x3a, 0x1d, 0x0e, 0x87, 0x43, 0xa1, 0x50,
    0x28, 0x94, 0x4a, 0xa5, 0x52, 0x29, 0x94, 0x4a,
    0x25, 0x12, 0x89, 0xc4, 0xe2, 0x71, 0xb8, 0xdc,
    0xee, 0xf7, 0x7b, 0x3d, 0x9e, 0xcf, 0x67, 0x33,
    0x19, 0x8c, 0xc6, 0xe3, 0x71, 0x38, 0x9c, 0xce,
    0x67, 0x33, 0x19, 0x8c, 0x46, 0x23, 0x11, 0x08,
    0x04, 0x82, 0x41, 0x20, 0x10, 0x88, 0x44, 0xa2,
    0xd1, 0xe8, 0x74, 0xba, 0xdd, 0x6e, 0xb7, 0xdb,
    0xed, 0xf6, 0x7b, 0x3d, 0x1e, 0x8f, 0xc7, 0xe3,
    0x71, 0x38, 0x1c, 0x8e, 0x47, 0x23, 0x91, 0x48,
    0x24, 0x12, 0x09, 0x04, 0x02, 0x01, 0x00, 0x80,
    0xc0, 0x60, 0x30, 0x18, 0x8c, 0x46, 0xa3, 0x51,
    0x28, 0x14, 0x8a, 0xc5, 0xe2, 0x71, 0xb8, 0x5c,
    0xae, 0x57, 0xab, 0xd5, 0x6a, 0xb5, 0x5a, 0x2d,
    0x16, 0x8b, 0x45, 0xa2, 0x51, 0x28, 0x94, 0xca,
    0x65, 0xb2, 0x59, 0x2c, 0x96, 0xcb, 0x65, 0xb2,
    0xd9, 0xec, 0xf6, 0x7b, 0xbd, 0xde, 0x6f, 0xb7,
    0xdb, 0x6d, 0xb6, 0x5b, 0xad, 0x56, 0x2b, 0x15,
    0x8a, 0x45, 0x22, 0x11, 0x08, 0x04, 0x82, 0xc1,
    0x60, 0xb0, 0x58, 0xac, 0xd6, 0xeb, 0xf5, 0x7a ];

function _0x0bb006(ms)
{
    ms.d[0] = movew(ms.d[3], ms.d[0]);

    ms.d[2] = clrw(ms.d[2]);
    ms.d[2] = moveb(ms.memory[ms.a[3]], ms.d[2]);

    ms.d[0] = addw(ms.d[2], ms.d[0]);
    ms.d[0] = andw(ms.d[1], ms.d[0]);

    ms.a[0] = movel(ms.a[4], ms.a[0]);
    ms.a[0] = addw(ms.d[0], ms.a[0]);

    ms.d[0] = movel(ms.a[2], ms.d[0]);

    ms.d[2] = 0;
    ms.d[2] = moveb(ms.memory[ms.a[0]], ms.d[2]);

    ms.d[0] = addl(ms.d[2], ms.d[0]);
    ms.a[0] = movel(ms.d[0], ms.a[0]);
    ms.d[0] = moveb(ms.memory[ms.a[0]], ms.d[0]);

    ms.d[0] = extw(ms.d[0]);
    ms.d[0] = subw(ms.a[1], ms.d[0]);
    ms.d[0] = asrw(0x01, ms.d[0]);

    ms.memory[ms.a[5]++] = _byte(ms.d[0]);
    ms.memory[ms.a[5]++] = _byte(lsrw(0x08, ms.d[0]));

    ms.d[3] = addw(0x01, ms.d[3]);
    if (_word(ms.d[3]) < 0xff)
    {
        ms.pc = 0x0bb006;
        return;
    }

    ms.pc = 0xffffff;
    return;
}

function get_table(id)
{
    if (id == PRIMARY_TABLE_ID)
        return SINE_WAVE_TABLE;
    else if (id == SECONDARY_TABLE_ID)
        return SECONDARY_TABLE;

    let index;
    let index_table = new Array();

    for (index = 0; index < 256; index++)
	index_table[index] = id * index;

    return index_table;
}

// a0 = Sine Wave Table Index.
// a2 = (0x002cc8) Sine Wave Table.
// a3 = Pointer to the Frame Index.
// a4 = (0xfff962) Secondary Table.
// a5 = (0xffedf8) Offset Table.
// d3 = Line Index.

function create_0x0bb006(mode, offset)
{
    let ms = new t_machine_state();

    ms.pc = 0x0bb006;

    ms.a[1] = 0x40; 
    ms.a[2] = _0x002cc8;
    ms.a[3] = _0xfffcbf;
    ms.a[4] = _0xfff962;
    ms.a[5] = _0xffedf8;
    ms.d[1] = 0xff;
    ms.d[3] = 0x0;

    ms.memory = new Array();

    let index;
    for (index = 0; index < 2048; index++)
        ms.memory[index] = 0;

    let primary_table = get_table(mode);
    let secondary_table = get_table(offset);

    for (index = 0; index < 256; index++)
    {
        ms.memory[_0x002cc8 + index] = primary_table[index];
        ms.memory[_0xfff962 + index] = secondary_table[index];
    }

    return ms;
}

function process_0x0bb006(ms)
{
    while(ms.pc != 0xffffff)
        if (ms.pc == 0x0bb006)
	    _0x0bb006(ms); 

    if (ms.memory[ms.a[3]] < 255)
        ms.memory[ms.a[3]]++;
    else ms.memory[ms.a[3]] = 0;

    ms.d[3] = 0;
    ms.a[5] = _0xffedf8;

    ms.pc = 0x0bb006;
}

function get_offset_table(ms)
{
    let offset;
    let offset_table = new Array();

    let index;
    for (index = 0; index < 256; index++)
    {
        offset = ms.memory[_0xffedf8 + (index * 2) + 0];
        offset |= ms.memory[_0xffedf8 + (index * 2) + 1] << 8;

        if (offset & 0x8000) offset|= 0xffff0000;
	offset_table[index] = offset;
    }

    return offset_table;
}

function update_display(background, offset_table)
{
    let display = document.getElementById('display');
    let context = display.getContext('2d');
    context.imageSmoothingEnabled = false;

    let index;
    for (index = 0; index < 240; index++)
    {
        context.drawImage(
	    background,

	    0,
	    index,
	    384,
	    1,
	
	    offset_table[index],
	    index,
	    384,
	    1);
    }
}

function geturlvars()
{
    let vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
	    (m, key, value) => { vars[key] = value; });

    return vars;
}

let mode = geturlvars()['mode'];
let offset = geturlvars()['offset'];

if ((mode == undefined) || isNaN(mode)) mode = -999;
if ((offset == undefined) || isNaN(offset)) offset = -998;

let ms = new create_0x0bb006(mode, offset);
