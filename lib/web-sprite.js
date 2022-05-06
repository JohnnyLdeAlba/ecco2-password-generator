let W_SPRITE_LEFT = 1;
let W_SPRITE_RIGHT = 2;
let W_SPRITE_UP = 3;
let W_SPRITE_DOWN = 4;
let W_SPRITE_LEFTRIGHT = 5;
let W_SPRITE_RIGHTLEFT = 6;
let W_SPRITE_ENABLE = -1;

let CelFilename = [
    'fish-101.png', // cel_id
    'fish-102.png',
    'fish-103.png',
    'fish-104.png',
    'fish-105.png',
    'fish-106.png',
    'fish-107.png',
    'fish-108.png',

    'blueshark-101.png', // cel_id
    'blueshark-102.png',
    'blueshark-103.png',
    'blueshark-104.png',
    'blueshark-105.png',
    'blueshark-106.png',
    'blueshark-107.png',
    'blueshark-108.png',
    'blueshark-109.png',

    'blueshark-201.png', // cel_id
    'blueshark-202.png',
    'blueshark-203.png',
    'blueshark-204.png',
    'blueshark-205.png',
    'blueshark-206.png',
    'blueshark-207.png',
    'blueshark-208.png',
    'blueshark-209.png',

    'blueshark-301.png', // cel_id
    'blueshark-302.png',
    'blueshark-303.png',
    'blueshark-304.png',
    'blueshark-305.png',
    'blueshark-306.png',
    'blueshark-307.png',
    'blueshark-308.png',
    'blueshark-309.png',
    'blueshark-310.png',
    'blueshark-311.png',
    'blueshark-312.png',

    'blueshark-401.png', // cel_id
    'blueshark-402.png',
    'blueshark-403.png',
    'blueshark-404.png',
    'blueshark-405.png',
    'blueshark-406.png',
    'blueshark-407.png',
    'blueshark-408.png',
    'blueshark-409.png',
    'blueshark-410.png',
    'blueshark-411.png',
    'blueshark-412.png'
];


let CharacterDef = [
    1,   // sequence_total
    2,   // sequence_clip_total
    0,1, // cel_id_table
    0,0, // cel_delay_table

    1,
    2,
    2,3,
    0,0,

    1,
    2,
    4,5,
    0,0,

    1,
    2,
    6,7,
    0,0,

    4,

    9,
    8,9,10,11,12,13,14,15,16,
    7,7, 7, 7, 7, 7, 7, 7, 7,

    9,
    17,18,19,20,21,22,23,24,25,
     7, 7, 7, 7, 7, 7, 7, 7, 7,

    12,
    26,27,28,29,30,31,32,33,34,35,36,37,
     3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,

    12,
    38,39,40,41,42,43,44,45,46,47,48,49,
     3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
];

let SpriteDef = [
    W_SPRITE_RIGHT,     // starting_state 
    0,                  // character_id
    70, 380,            // origin
    300, 0,             // boundry 
    3, 0,               // velocity
    update_sprite_fish, // function

    W_SPRITE_RIGHT, 
    2,
    40, 420,
    200, 0,
    2, 0,
    update_sprite_fish,

    W_SPRITE_RIGHT, 
    0,
    180, 460,
    100, 0,
    1,0,
    update_sprite_fish,

    W_SPRITE_RIGHT, 
    0,
    60, 480, 
    200, 0,
    2, 0,
    update_sprite_fish,

    W_SPRITE_RIGHT, 
    3,
    20, 540, 
    300, 0,
    3, 0,
    update_sprite_fish,

    W_SPRITE_RIGHT, 
    0,
    -350, 380,
    200, 0,
    2, 0,
    update_sprite_fish,

    W_SPRITE_RIGHT, 
    1,
    -420, 460,
    300, 0,
    3, 0,
    update_sprite_fish,

    W_SPRITE_RIGHT, 
    1,
    -320, 500,
    100, 0,
    1, 0,
    update_sprite_fish,

    W_SPRITE_RIGHT, 
    0,
    -400, 540,
    300, 0,
    3, 0,
    update_sprite_fish,

    W_SPRITE_LEFT, 
    4,
    200, 500,
    500, 0,
    2, 0,
    update_sprite_shark,
];

let ACTOR_TOTAL = 5;
let W_SPRITE_TOTAL = 10;
let W_SPRITE_DIR = 'resources/w_sprite/';

function t_sequence()
{
    this.resource_index = 0;
    this.cel_total = 0;

    this.cel = null;
    this.delay = null;
}

function t_web_sprite()
{
    this.id = 0;

    this.sequence = null;    

    this.state = 0;
    this.prev_state = -1;

    this.w_resource = null;
    this.w_resource_id = null;
    this.w_resource_index = 0;

    this.sequence = null;    
    this.sequence_id = 0;

    this.cel_total = 0;
    this.cel_index = 0;
    this.cel_delay = 0;
    this.cel_cycle = 0;

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.velocity_x = 0;
    this.velocity_y = 0;

    this.data = null;
    this.process = null;
}

function set_w_resource_style(w_resource, x, y, visible)
{
    w_resource.style.left = x + 'px';
    w_resource.style.top = y + 'px';

    if (visible == 1) w_resource.style.display = 'block';
    else w_resource.style.display = 'none';    
}

function disable_all_w_resource(w_resource)
{
    let index = 0;
    for (index = 0; index < w_resource.length; index++)
        set_w_resource_style(w_resource[index], 0, 0, 0);
}



function enable_sprite(w_sprite)
{
    w_sprite.process = get_sprite_property(w_sprite.id, 8);
}

function disable_sprite(w_sprite)
{
    w_sprite.process = null;
   
    disable_all_w_resource(w_sprite.w_resource); 
}

function get_cel_filename(id)
{ return CelFilename[id]; }

function get_ch_property(offset, id)
{ return CharacterDef[offset + id]; }

function get_ch_index(id)
{
    let index = 0, x = 0, y = 0;
    let sequence_total = 0, cel_total = 0;

    for (x = 0; x < ACTOR_TOTAL; x++)
    {
        if (id == x) return index;
        
        sequence_total = get_ch_property(index, 0);
       
        for (y = 0; y < sequence_total; y++)
        {
            cel_total = get_ch_property(index, 1);

            index+= 2;
            index+= cel_total * 2;
        }
    }

    return -1;
}

function get_ch_sequences(id)
{
    let index = 0, x = 0, y = 0;

    let ch_index = 0
    let cel_total = 0, sequence_total = 0;

    let sequence = null;

    sequence = new Array();

    ch_index = get_ch_index(id);
    sequence_total = get_ch_property(ch_index, 0);
    index++;

    for (x = 0; x < sequence_total; x++)
    {
        cel_total = get_ch_property(ch_index + index, 0);

        sequence[x] = new t_sequence();
        sequence[x].cel_total = cel_total;

        sequence[x].cel = new Array();
        sequence[x].delay = new Array();

        index+= 1;

        for (y = 0; y < cel_total; y++)
        {
            sequence[x].cel[y] = get_ch_property(
                ch_index + index, y);

            sequence[x].delay[y] = get_ch_property(
                ch_index + index, cel_total + y);
        }

        index+= cel_total * 2;
    }

    return new Array(sequence_total, sequence);
}

function get_w_resource_index(w_resource_id, sequence_id, cel_id)
{
    let index = 0, id = 0;
    for (index = 0; index < w_resource_id.length; index++)
    {
        id = (sequence_id * 1000) + cel_id;
        if (id == w_resource_id[index])
            return index;
    }     

    return -1;
}

function enable_w_sprite_cel(w_sprite, id, x, y)
{
    let index = w_sprite.w_resource_index + id;

    disable_all_w_resource(w_sprite.w_resource);
    set_w_resource_style(w_sprite.w_resource[index], x, y, 1);
}

function update_sprite_fish(w_sprite)
{
    let id = w_sprite.id;

    let origin_x = get_sprite_property(id, 2);
    let origin_y = get_sprite_property(id, 3);

    let boundry_w = get_sprite_property(id, 4);
    let boundry_h = get_sprite_property(id, 5);
 
    let velocity_x = get_sprite_property(id, 6);
    let velocity_y = get_sprite_property(id, 7);

    let x = 0, y = 0, total = 0;
    let resource_id = 0;
    let current_id = 0;

    w_sprite.y = origin_y;
    w_sprite.w_resource_index = get_w_resource_index(
        w_sprite.w_resource_id, w_sprite.sequence_id, 0);


    if (w_sprite.x > (origin_x + boundry_w))
        w_sprite.state = W_SPRITE_LEFT;
    else if (w_sprite.x <= origin_x)
        w_sprite.state = W_SPRITE_RIGHT;

    switch (w_sprite.state)
    {
        case W_SPRITE_LEFT:
        {
            w_sprite.velocity_x = velocity_x * -1;
            w_sprite.x+= w_sprite.velocity_x; 

            if (origin_x < 0)
            {   
                if (window.innerWidth > 640)
                    x = window.innerWidth - (w_sprite.x * -1);
                else x = -9999;
            }
            else x = w_sprite.x;
 
            enable_w_sprite_cel(w_sprite, 0, x, w_sprite.y);
            break;
        }
 
        case W_SPRITE_RIGHT:
        {
            w_sprite.velocity_x = velocity_x;
            w_sprite.x+= w_sprite.velocity_x;

            x = Math.floor(w_sprite.x);

            if (origin_x < 0)
            {   
                if (window.innerWidth > 640)
                    x = window.innerWidth - (x * -1);
                else x = -9999;
            }

            enable_w_sprite_cel(w_sprite, 1, x, w_sprite.y);
            break;
        }
   }
}

function get_w_sprite_cel(w_sprite, index)
{
    if (index == -1)
        index = w_sprite.cel_index;

    return w_sprite
        .sequence[w_sprite.sequence_id]
        .cel[index];
}

function get_w_sprite_cel_delay(w_sprite)
{
    return w_sprite
        .sequence[w_sprite.sequence_id]
        .delay[w_sprite.cel_index];
}

function get_w_sprite_cel_total(w_sprite)
{
    return w_sprite
        .sequence[w_sprite.sequence_id]
        .cel_total;
}

function get_w_sprite_resource_index(w_sprite)
{
    return w_sprite
        .sequence[w_sprite.sequence_id]
        .resource_index;
}

function update_w_sprite_cel(w_sprite)
{
    w_sprite.cel_cycle++;

    if (w_sprite.cel_cycle >= w_sprite.cel_delay)
    {
        w_sprite.cel_index++;
        if (w_sprite.cel_index >= w_sprite.cel_total)
            w_sprite.cel_index = 0;

        w_sprite.cel_cycle = 0;
        w_sprite.cel_delay = get_w_sprite_cel_delay(w_sprite);
    }
}

function update_w_sprite_state(w_sprite)
{
    if (w_sprite.state == w_sprite.prev_state)
        return;

    // added to fix bug
    if (w_sprite.state == W_SPRITE_RIGHT)
        w_sprite.sequence_id = 1;


    w_sprite.cel_index = 0;
    w_sprite.cel_cycle = 0;

    w_sprite.cel_total = get_w_sprite_cel_total(w_sprite);

    w_sprite.cel_delay = get_w_sprite_cel_delay(w_sprite);
    w_sprite.w_resource_index = get_w_sprite_resource_index(w_sprite);

    w_sprite.prev_state = w_sprite.state;

    return;
}

function update_sprite_shark(w_sprite)
{
    let id = w_sprite.id;

    let origin_x = get_sprite_property(id, 2);
    let origin_y = get_sprite_property(id, 3);

    let boundry_w = get_sprite_property(id, 4);
    let boundry_h = get_sprite_property(id, 5);
 
    let velocity_x = get_sprite_property(id, 6);
    let velocity_y = get_sprite_property(id, 7);

    let x = 0, y = 0;

    w_sprite.y = origin_y;
/*
    if (w_sprite.x > (origin_x + boundry_w))
    {
        w_sprite.state = W_SPRITE_RIGHTLEFT;
        w_sprite.sequence_id = 3;
    }
    else if (w_sprite.x <= origin_x)
    {
        w_sprite.state = W_SPRITE_LEFTRIGHT;
        w_sprite.sequence_id = 2;
    }
*/
    w_sprite.y = origin_y;

    update_w_sprite_state(w_sprite);
    update_w_sprite_cel(w_sprite);

    switch (w_sprite.state)
    {
        case W_SPRITE_LEFT:
        {
            w_sprite.velocity_x = velocity_x * -1;
            w_sprite.x+= w_sprite.velocity_x; 

            x = w_sprite.x;

            if (origin_x < 0)
            {   
                if (window.innerWidth > 640)
                    x = window.innerWidth - (w_sprite.x * -1);
                else x = -9999;
            }

            if (w_sprite.x <= origin_x)
            {
                w_sprite.state = W_SPRITE_LEFTRIGHT;
                w_sprite.sequence_id = 2;
            }

            break;
        }
 
        case W_SPRITE_RIGHT:
        {
            w_sprite.velocity_x = velocity_x;
            w_sprite.x+= w_sprite.velocity_x;

            x = w_sprite.x;

            if (origin_x < 0)
            {   
                if (window.innerWidth > 640)
                    x = window.innerWidth - (x * -1);
                else x = -9999;
            }

            if (w_sprite.x > (origin_x + boundry_w))
            {
                w_sprite.state = W_SPRITE_RIGHTLEFT;
                w_sprite.sequence_id = 3;
            }
 
            break;
        }

        case W_SPRITE_LEFTRIGHT:
        {
            w_sprite.velocity_x = velocity_x;
            w_sprite.x+= w_sprite.velocity_x;

            x = w_sprite.x;

            if (origin_x < 0)
            {   
                if (window.innerWidth > 640)
                    x = window.innerWidth - (x * -1);
                else x = -9999;
            }

           if (w_sprite.cel_index >= (w_sprite.cel_total - 1))
            {
                w_sprite.state = W_SPRITE_RIGHT;
                w_sprite.sequence_id = 1;
            }

            break;
        }
 
        case W_SPRITE_RIGHTLEFT:
        {
            w_sprite.velocity_x = velocity_x * -1;
            w_sprite.x+= w_sprite.velocity_x; 

            x = w_sprite.x;

            if (origin_x < 0)
            {   
                if (window.innerWidth > 640)
                    x = window.innerWidth - (w_sprite.x * -1);
                else x = -9999;
            }


            if (w_sprite.cel_index >= (w_sprite.cel_total - 1))
            {
                w_sprite.state = W_SPRITE_LEFT;
                w_sprite.sequence_id = 0;
            }

            break;
        }
 
   }


   enable_w_sprite_cel(w_sprite, w_sprite.cel_index, x, w_sprite.y);
}



function get_sprite_property(id, index)
{ return SpriteDef[(id * 9) + index]; }


function create_w_resource(path, sequence, sequence_total)
{
   let x = 0,  y = 0, index = 0;

   let cel_index = 0, cel_total = 0;
   let cel_filename = null;

   let w_resource_id = null;
   let w_resource = null;

   w_resource = new Array();
   w_resource_id = new Array();

   for (x = 0; x < sequence_total; x++)
    {
        cel_total = sequence[x].cel_total;
        sequence[x].resource_index = index;

        for (y = 0; y < cel_total; y++)
        {
            w_resource[index] = new Image();
        
            cel_index = sequence[x].cel[y];
            cel_filename = get_cel_filename(cel_index);

            w_resource[index].setAttribute(
                'src',
                path + W_SPRITE_DIR + cel_filename);

            w_resource[index].setAttribute('class', 'web_sprite');

            w_resource[index].addEventListener('load', (event) => {
                document.body.appendChild(event.target); });

            w_resource[index].addEventListener('mousedown', () => {
                disable_sprite(w_sprite); });

            w_resource_id[index] = (x * 1000) + y;

            index++;
        }
    }

    return new Array(w_resource_id, w_resource);
}

function create_web_sprite(path, id)
{
    let index = 0, x = 0, y = 0;
    let w_sprite = null;

    let ch_id = 0;
    let sequence_total = null;
    let sequence = null;

    let result = null;

    w_sprite = new t_web_sprite();
    ch_id = get_sprite_property(id, 1);

    result = get_ch_sequences(ch_id);

    sequence_total = result[0];
    sequence = result[1];

    result = create_w_resource(path, sequence, sequence_total);

    w_sprite.w_resource_id = result[0];
    w_sprite.w_resource = result[1];
    
    w_sprite.id = id;

    w_sprite.sequence_total = sequence_total;
    w_sprite.sequence = sequence;

    w_sprite.state = get_sprite_property(id, 0);
    w_sprite.prev_state = -1;

    w_sprite.x = get_sprite_property(id, 2);
    w_sprite.y = get_sprite_property(id, 3);

    w_sprite.process = get_sprite_property(id, 8);

    return w_sprite;
}

// need to load direction defaults so proper starting animation gets loaded.

function process_web_sprites(WSPRITE_PATH)
{
    let result = get_cookie('wsprite_enable');

    if (W_SPRITE_ENABLE == -2)
        return;
 
    if (result == '') W_SPRITE_ENABLE = 1;
    else W_SPRITE_ENABLE = parseInt(result);

    let w_sprite = new Array();

    let index; for (index = 0; index < W_SPRITE_TOTAL; index++)
        w_sprite[index] = create_web_sprite(WSPRITE_PATH, index);

    setInterval(() => {

        let total = w_sprite.length;

        for (index = 0; index < total; index++)
        {
            if (W_SPRITE_ENABLE ==  -1)
            {
                if (w_sprite[index].process == null)
                    enable_sprite(w_sprite[index]);
                else W_SPRITE_ENABLE = 1;        
            }

            else if (W_SPRITE_ENABLE == 1)
            {
                if (w_sprite[index].process != null) 
                    w_sprite[index].process(w_sprite[index]);
            }
   
            else
            {
                if (w_sprite[index].process != null) 
                    disable_sprite(w_sprite[index])
            }
        }

    }, 1000 / 60);
}


