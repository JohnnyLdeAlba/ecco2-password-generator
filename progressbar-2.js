const PB_BLOCK_W = 1;
const PB_BLOCK_H = 12;
const PB_SIDE_W = 12;
const PB_SIDE_H = 12;
const PB_TICK_W = 2;
const PB_TICK_H = 28;
const PB_POINTER_W = 20;
const PB_POINTER_H = 20;

const PB_STENCIL_LEFT = 0;
const PB_STENCIL_RIGHT = 1;
const PB_STENCIL_BLOCK = 2;
const PB_STENCIL_TICK = 3;
const PB_STENCIL_LEFTHL = 4;
const PB_STENCIL_RIGHTHL = 5;
const PB_STENCIL_BLOCKHL = 6;
const PB_STENCIL_TICKHL = 7;
const PB_STENCIL_POINTER = 8;

const PB_UPDATE = 1;
const PB_HOVER = 2;
const PB_DROP = 3;

function pb_default_stencil_table()
{
    let table = [
        "resources/progressbar-left.svg",
        "resources/progressbar-right.svg",
        "resources/progressbar-block.svg",
        "resources/progressbar-tick.svg",
        "resources/progressbar-left-highlighted.svg",
        "resources/progressbar-right-highlighted.svg",
        "resources/progressbar-block-highlighted.svg",
        "resources/progressbar-tick-highlighted.svg",
        "resources/progressbar-pointer.svg"
    ];

    return table;  
}

function t_progressbar()
{
    this.side_w = PB_SIDE_W;
    this.side_h = PB_SIDE_H;
    this.block_w = PB_BLOCK_W;
    this.block_h = PB_BLOCK_H;
    this.tick_w = PB_TICK_W;
    this.tick_h = PB_TICK_H;

    this.pointer_w = PB_POINTER_W;
    this.pointer_h = PB_POINTER_H;
    this.pointer_top = (PB_TICK_H - PB_POINTER_H)/2;
    this.pointer_left = (PB_POINTER_H/2) - 1;

    this.boundary_w = this.pointer_w*2;
    this.boundary_h = this.pointer_h*2;
    this.boundary_top = (this.boundary_h - this.pointer_h)/2;
    this.boundary_left = (this.boundary_w - this.pointer_w)/2;

    this.padding_top = (PB_TICK_H - PB_SIDE_H)/2;
    this.padding_left = (PB_POINTER_W - PB_SIDE_W)/2;
    this.inner_left = this.padding_left + ((this.side_w - this.tick_w)/2);

    this.width = 0;
    this.height = 0;
    this.padding_w = 0;
    this.inner_w = 0;

    this.active = 0;
    this.resource_index = 0;
    this.resource_total = 0;
    this.tick_hidden = 0;
 
    this.container_x = 0;
    this.container_y = 0;

    this.pointer_x = 0;
    this.pointer_index = 0;
    this.boundary_x = 0;
    this.boundary_y = 0;

    this.container_id = "";
    this.container = null;
    this.bitmap = null;
   
    this.handler = null;
    this.instance = null;

    this.r_tick_position = null;
    this.r_tick_enabled = null; 
    this.r_stencil = null;
}

function pb_stencil_array(pb)
{
    let table = pb_default_stencil_table();
    let stencil = new Array();
    let index = 0;

    for (index = 0; index < table.length; index++)
    {
        stencil[index] = new Image();
        stencil[index].src = table[index];

        stencil[index].addEventListener("load", (event) => {
            pb.resource_index++; });

        pb.resource_total++;
    }

    pb.r_stencil = stencil;
}

function pb_destroy_bitmap(pb)
{
    if (pb.bitmap == null) return;
    
    pb.container.removeChild(pb.bitmap);
    pb.bitmap.remove();
    pb.bitmap = null;
}

function pb_create_bitmap(pb, width)
{
    pb_destroy_bitmap(pb);

    let bitmap = document.createElement("canvas");

    bitmap.width = width;
    bitmap.height = pb.tick_h;

    pb.width = width;
    pb.height = bitmap.height;

    pb.padding_w = width - (pb.padding_left*2);
    pb.inner_w = pb.padding_w - pb.side_w;

    pb.bitmap = bitmap;
    pb.container.appendChild(pb.bitmap);
}

function pb_tick_position_array(pb)
{
    let index = 0;
    pb.r_tick_position = new Array();

    for (index = 0; index < pb.tick_total; index++)
        pb.r_tick_position[index] = 0;
}

function pb_tick_enabled_array(pb)
{
    let index = 0;
    pb.r_tick_enabled = new Array();

    for (index = 0; index < pb.tick_total; index++)
        pb.r_tick_enabled[index] = 1;
}

function pb_update_tick_position_array(pb)
{
    let tick_position = pb.inner_w/(pb.tick_total - 1);
    let last_index = pb.tick_total - 1;

    let index = 0, x = 0;

    for (index = 0; index < pb.tick_total; index++)
    {
        x = (index * tick_position) + pb.inner_left;
        if (index == last_index)
            x = pb.inner_w + pb.inner_left;

        x = Math.trunc(x);
        pb.r_tick_position[index] = x;
    }
}


function pb_current_tick(pb, x)
{
    let last_index = pb.tick_total - 1;
    let index = 0;

    for (index = 0; index < pb.tick_total; index++)
    {
       if (pb.r_tick_enabled[last_index - index] == 1)
           if (x >= pb.r_tick_position[last_index - index])
               return last_index - index;
    }

    return -1;
}

function pb_next_tick(pb, id)
{
    let index = 0;

    for (index = 0; index < pb.tick_total; index++)
    {
       if (index > id)
           if (pb.r_tick_enabled[index] == 1)
               return index;
    }

    return -1;
}

function pb_previous_tick(pb, id)
{
    let index = 0;
    let previous_index = -1;

    for (index = 0; index < pb.tick_total; index++)
    {
       if (index == id)
           return previous_index;

       if (pb.r_tick_enabled[index] == 1)
           previous_index = index;
    }

    return -1;
}

function pb_set_pointer(pb, x)
{
    let inner_right = pb.inner_left + pb.inner_w;

    if (x < pb.inner_left)
        x = pb.inner_left;
    else if (x > inner_right)
        x = inner_right;

    pb.boundary_x = x - pb.boundary_left;
    pb.boundary_y = pb.pointer_top - pb.boundary_top; 

    pb.pointer_x = x;
}

function pb_set_pointer_index(pb, index)
{
    pb.pointer_index = index;
    pb_set_pointer(
        pb,
        pb.r_tick_position[index]
    );
}

function pb_snap_pointer(pb, x)
{
    if (pb.tick_total == 0) return;

    let index = 0;
    let width = 0;
    let previous_index = 0, next_index = 0;
    let tick_position = 0;
    let last_index = pb.tick_total - 1;

    r_tick_position = pb.r_tick_position;

    index = pb_current_tick(pb, x);

    if (pb.r_tick_enabled[index] == 0)
        index = pb_previous_tick(pb, index);

    if (index == -1)
        index = pb_next_tick(pb, index);

    next_index = pb_next_tick(pb, index);

    if (x >= r_tick_position[index])
    {
        width = r_tick_position[next_index] - r_tick_position[index];
        width = Math.trunc(width/2);

        if (x >= r_tick_position[index] + width)
        {
            pb_set_pointer_index(pb, next_index);
            return;
        }
    }

    pb_set_pointer_index(pb, index);
}

function pb_clear_rect(pb)
{
    let context = pb.bitmap.getContext("2d");
 
    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, pb.width, pb.height);
}

function pb_tick_render_all(pb)
{
    if (pb.tick_hidden == 1) return;

    let context = pb.bitmap.getContext("2d");
    let index = 0, position_x = 0;
 
    context.imageSmoothingEnabled = false;

    for(index = 0; index < pb.tick_total; index++)
    {
        if (pb.r_tick_enabled[index] == 0)
            continue;

        position_x = pb.r_tick_position[index];

        context.drawImage(pb.r_stencil[PB_STENCIL_TICK], position_x, 0);
        if (pb.pointer_x >= position_x && pb.pointer_x < position_x + pb.tick_w)
            context.drawImage(pb.r_stencil[PB_STENCIL_TICKHL], position_x, 0);
    }
}

function pb_block_render_all(pb)
{
    let context = pb.bitmap.getContext("2d");
    let index = 0, position_x = 0;
 
    context.imageSmoothingEnabled = false;

    position_x = pb.padding_left;
    context.drawImage(pb.r_stencil[PB_STENCIL_LEFT], position_x, pb.padding_top);

    index = pb.side_w;
    while(index < pb.inner_w)
    {
        position_x = pb.padding_left + index;
        context.drawImage(pb.r_stencil[PB_STENCIL_BLOCK], position_x, pb.padding_top);

        index+= 1;
    }
 
    position_x = pb.padding_left + pb.padding_w - pb.side_w;
    context.drawImage(pb.r_stencil[PB_STENCIL_RIGHT], position_x, pb.padding_top); 
}

function pb_blockhl_render_all(pb)
{
    let context = pb.bitmap.getContext("2d");
    let index = 0, position_x = 0;
 
    context.imageSmoothingEnabled = false;
    width = pb.pointer_x + (pb.side_w/2) - pb.inner_left;

    position_x = pb.padding_left;
    context.drawImage(pb.r_stencil[PB_STENCIL_LEFTHL], position_x, pb.padding_top);

    index = pb.side_w;
    while(index < width)
    {
        position_x = pb.padding_left + index;
        context.drawImage(pb.r_stencil[PB_STENCIL_BLOCKHL], position_x, pb.padding_top);

        index+= 1;
    }

    if (width >= pb.inner_w)
    { 
        position_x = pb.padding_left + pb.padding_w - pb.side_w;
        context.drawImage(pb.r_stencil[PB_STENCIL_RIGHTHL], position_x, pb.padding_top); 
    }
}

function pb_block_render_all(pb)
{
    let context = pb.bitmap.getContext("2d");
    let index = 0, position_x = 0;
 
    context.imageSmoothingEnabled = false;

    position_x = pb.padding_left;
    context.drawImage(pb.r_stencil[PB_STENCIL_LEFT], position_x, pb.padding_top);

    index = pb.side_w;
    while(index < pb.inner_w)
    {
        position_x = pb.padding_left + index;
        context.drawImage(pb.r_stencil[PB_STENCIL_BLOCK], position_x, pb.padding_top);

        index+= 1;
    }
 
    position_x = pb.padding_left + pb.padding_w - pb.side_w;
    context.drawImage(pb.r_stencil[PB_STENCIL_RIGHT], position_x, pb.padding_top); 
}

function pb_pointer_render(pb)
{
    let context = pb.bitmap.getContext("2d");

    context.imageSmoothingEnabled = false;
    context.drawImage(pb.r_stencil[PB_STENCIL_POINTER], pb.pointer_x - pb.pointer_left, pb.pointer_top);
}

function pb_render(pb)
{
    if (pb.bitmap == null) return;

    pb_clear_rect(pb);
    pb_tick_render_all(pb);
    pb_block_render_all(pb);
    pb_blockhl_render_all(pb);
    pb_pointer_render(pb);
}

function pb_update(pb)
{
    pb_update_tick_position_array(pb);
    pb_set_pointer_index(pb, pb.pointer_index);
    pb_render(pb);
}

function pb_resize(pb)
{
    pb.width = pb.container.getBoundingClientRect().width;

    if (pb.width == 0)
    {
        pb_destroy_bitmap(pb);
        setTimeout(() => { pb_resize(pb); }, 1000);

        return;
    }

    pb_create_bitmap(pb, pb.width);
    pb_update(pb);
    pb_render(pb);
}

function pb_listener_ready(pb)
{
    if (pb.resource_index < pb.resource_total)
    {
        setTimeout(() => { pb_listener_ready(pb); }, 1000);
        return;
    }

    pb_resize(pb);
}

function pb_listener_pointer_down(pb, x, y)
{
    if (pb.active == 1) return;

    pb.container_x = pb.container.getBoundingClientRect().left;
    pb.container_y = pb.container.getBoundingClientRect().top;

    x-= pb.container_x;
    y-= pb.container_y;

    if (x < pb.boundary_x || x > pb.boundary_x + pb.boundary_w) return;
    if (y < pb.boundary_y || y > pb.boundary_y + pb.boundary_h) return;

    pb.active = 1;
    event.preventDefault();
}

function pb_listener_pointer_move(pb, x)
{
    if (pb.active == 0) return;

    x-= pb.container_x;

    pb_set_pointer(pb, x);
    pb_render(pb);

    if (pb.handler != null) pb.handler(pb, PB_HOVER);
}

function pb_listener_pointer_up(pb, event)
{
    if (pb.active == 0) return;
    if (pb.active == 1) pb.active = 0;

    pb_snap_pointer(pb, pb.pointer_x);
    pb_render(pb);

    if (pb.handler != null) pb.handler(pb, PB_DROP);
}

function create_progressbar(container_id, tick_total)
{
    let pb = new t_progressbar();

    pb.container_id = container_id;
    pb.container = document.getElementById(container_id);
    pb.tick_total = tick_total;

    pb_tick_position_array(pb);
    pb_tick_enabled_array(pb);
    pb_stencil_array(pb);

    window.addEventListener("pointerdown", (event) => {
        pb_listener_pointer_down(pb, event.clientX, event.clientY); });

    window.addEventListener("pointermove", (event) => {
        pb_listener_pointer_move(pb, event.clientX); });

    window.addEventListener("pointerup", (event) => {
       pb_listener_pointer_up(pb, event); });

    window.addEventListener("touchstart", (event) => {
        pb_listener_pointer_down(pb,
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY); });

    window.addEventListener("touchmove", (event) => {
        pb_listener_pointer_move(pb,
            event.changedTouches[0].clientX); });

    window.addEventListener("touchend", (event) => {
       pb_listener_pointer_up(pb, event); });

    window.addEventListener("touchcancel", (event) => {
       pb_listener_pointer_up(pb, event); });

    window.addEventListener("resize", (event) => {
        pb_resize(pb); });

    setTimeout(() => { pb_listener_ready(pb); }, 1000);

    return pb;
}


