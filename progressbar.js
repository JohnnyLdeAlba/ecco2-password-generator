function t_progressbar()
{
    this.parent_id = null;
    this.container = null;

    this.active = 0;
    this.container_x = 0;

    this.x = 0;
    this.tick = 0;
    this.tick_max = 0;
    this.tick_total = 0;
    this.tick_spacing = 0;
    this.tick_spacing_array = null;
    this.tick_enabled_array = null;

    this.tick_array = null;
    this.tickhl_array = null;

    this.resource_index = 0;
    this.resource_total = 0;

    this.width = 0;
    this.max_width = 0;

    this.block_max = 0;
    this.block_total = 0;

    this.slider = null;
    this.block_array = null;
    this.blockhl_array = null;

    this.instance = null;
    this.handler = null;
}

const PROGRESSBAR_BLOCK_W = 12;
const PROGRESSBAR_BLOCK_H = 12;
const PROGRESSBAR_TICK_W = 2;
const PROGRESSBAR_TICK_H = 28;
const SLIDER_W = 20;
const SLIDER_H = 20;

const PROGRESSBAR_LEFT_IMAGE = "resources/progressbar-left.svg";
const PROGRESSBAR_RIGHT_IMAGE = "resources/progressbar-right.svg";
const PROGRESSBAR_BLOCK_IMAGE = "resources/progressbar-block.svg";
const PROGRESSBAR_SLIDER_IMAGE = "resources/sliderbar-large-circle.svg";
const PROGRESSBAR_TICK_IMAGE = "resources/progressbar-tick.svg";
const PB_TICKBLANK_IMAGE = "resources/progressbar-tick-blank.png";

const PB_UPDATE = 1;
const PB_HOVER = 2;
const PB_DROP = 3;

let PROGRESSBAR_LEFT = 0;
let PROGRESSBAR_TOP = (PROGRESSBAR_TICK_H - PROGRESSBAR_BLOCK_H)/2;

let PROGRESSBAR_TICK_LEFT = PROGRESSBAR_LEFT + ((PROGRESSBAR_BLOCK_W - PROGRESSBAR_TICK_W)/2);
let PROGRESSBAR_TICK_RIGHT = PROGRESSBAR_LEFT - ((PROGRESSBAR_BLOCK_W + PROGRESSBAR_TICK_W)/2);

let SLIDER_LEFT = PROGRESSBAR_LEFT - ((SLIDER_W - PROGRESSBAR_BLOCK_W)/2);
let SLIDER_RIGHT = PROGRESSBAR_LEFT - ((SLIDER_W + PROGRESSBAR_BLOCK_W)/2);

function create_pointer_resource(sliderbar)
{
    let y = (PROGRESSBAR_TICK_H - SLIDER_H)/2;
    let total = sliderbar.block_total;
    let image = new Image();

    image.classList.add("web_sprite");
    image.style.pointerEvents = "none;"
    image.setAttribute("draggable", "false");

    image.style.zIndex = "9";
    image.style.top = y + "px";
    image.style.left = 0 + "px";

    image.src = PROGRESSBAR_SLIDER_IMAGE;

    image.addEventListener("load", (e) => {
        sliderbar.container.appendChild(e.target);
        sliderbar.resource_index++;
    });

    sliderbar.resource_total++;
    return image;
}

function create_image(class_id, uri, x, y, z, load_listener)
{
    let image = new Image();

    image.classList.add(class_id);
    image.src = uri;

    image.style.left = x + "px";
    image.style.top =  y + "px";
    image.style.zindex = "0";

    image.addEventListener("load", load_listener);
    return image;
}

function set_image(image, x, y, z)
{
    image.style.left = x + "px";
    image.style.top =  y + "px";
    image.style.zindex = z;
}

function create_progressbar_image_array(pb, total, uri_list)
{
    let index = 0;
    let image = new Array();

    for (index = 0; index < total; index++)
    {
        image[index] = create_image
        (
            "web_sprite",
            uri_list[index],
            0, 0, 0,
            (event) =>
            {
                pb.container.appendChild(event.target);
                pb.resource_index++;
            }
        );

        pb.resource_total++;
    }

    return image;
}

function pb_update_tick_spacing(pb)
{
    let index = 0, x = 0;
    let last_tick = 0;
    let tick_spacing_array = new Array();

    pb.tick_spacing = (pb.width - PROGRESSBAR_BLOCK_W)/(pb.tick_total - 1);
    last_tick = pb.tick_total - 1;

    for (index = 0; index < pb.tick_total; index++)
    {
        x = (index * pb.tick_spacing) + PROGRESSBAR_TICK_LEFT;
        if (index == last_tick)
            x = pb.width + PROGRESSBAR_TICK_RIGHT;

        x = Math.trunc(x);
        tick_spacing_array[index] = x;
    }

    pb.tick_spacing_array = tick_spacing_array;
}

function pb_update_ticks(pb)
{
    pb_update_tick_spacing(pb);
    if (pb.tick_array == null)
        return null;

    let index = 0;
    for (index = 0; index < pb.tick_total; index++)
    {
        if (pb.tick_enabled_array[index] == 0)
            continue;

        set_image(pb.tick_array[index], 
            pb.tick_spacing_array[index], 0, 1);
        set_image(pb.tickhl_array[index],
            pb.tick_spacing_array[index], 0, 0);
    }
}

function pb_create_ticks(pb, tick_list)
{
    if (tick_list == null)
    {
        pb_update_tick_spacing(pb);
        return null;
    }

    let index = 0;

    let tick_enabled_array = new Array();
    let tickhl_list = new Array();

    for (index = 0; index < pb.tick_total; index++)
    {
        tick_enabled_array[index] = 1;
        tickhl_list[index] = tick_list[index]
            .replace(".", "-highlighted.");
    }

    pb.tick_enabled_array = tick_enabled_array;

    pb.tickhl_array = create_progressbar_image_array(
        pb, pb.tick_total, tickhl_list);
    pb.tick_array = create_progressbar_image_array(
        pb, pb.tick_total, tick_list);
}

function pb_clear_blocks(pb)
{
    let index = 0;

    for (index = 0; index < pb.block_max; index++)
    {
        pb.block_array[index].style.display = "none";
        pb.blockhl_array[index].style.display = "none";

        set_image(pb.block_array[index], 0, 0, -999);
        set_image(pb.blockhl_array[index], 0, 0, -999);
    }
}

function pb_disable_blocks(pb)
{
    let index = 0;

    for (index = 0; index < pb.block_max; index++)
    {
        pb.block_array[index].style.display = "none";
        pb.blockhl_array[index].style.display = "none";

        pb.block_array[index].style.zIndex = -999;
        pb.blockhl_array[index].style.zIndex = -999;
    }
}

function pb_update_blocks(pb)
{
    let index = 0; id = 0;
    let x = 0, y = 0;

    let last_index = 0;
    let last_element = 0;

    pb.block_total = Math.trunc(pb.width/PROGRESSBAR_BLOCK_W);
    if (pb.block_total < 3) pb.block_total = 3;
    if (pb.block_total > pb.block_max) pb.block_total = pb.block_max;
    pb.width = pb.block_total * PROGRESSBAR_BLOCK_W;

    y = PROGRESSBAR_TOP;

    last_index = pb.block_total - 1;
    last_element = pb.block_max - 1;

    pb_clear_blocks(pb);

    for (index = 0; index < pb.block_total; index++)
    {
        x = index * PROGRESSBAR_BLOCK_W;
        x+= PROGRESSBAR_LEFT;

        id = index;
        if (id == last_index) id = last_element;

        pb.block_array[id].style.display = "block";
        pb.blockhl_array[id].style.display = "block";

        set_image(pb.block_array[id], x, y, 2);
        set_image(pb.blockhl_array[id], x, y, 3);
    }
}

function pb_create_blocks(pb)
{
    let index = 0;
    let last_element = 0;

    let block_list = new Array();
    let blockhl_list = new Array();

    pb.block_max = Math.trunc(pb.max_width/PROGRESSBAR_BLOCK_W);
    if (pb.block_max < 3) pb.block_max = 3;
    pb.max_width = pb.block_max * PROGRESSBAR_BLOCK_W;

    last_element = pb.block_max - 1;

    for (index = 0; index < pb.block_max; index++)
    {
        if (index == 0)
            block_list[index] = PROGRESSBAR_LEFT_IMAGE;
        else if (index == last_element)
            block_list[index] = PROGRESSBAR_RIGHT_IMAGE;
        else 
            block_list[index] = PROGRESSBAR_BLOCK_IMAGE;

        blockhl_list[index] = block_list[index]
            .replace(".", "-highlighted.");
 
    }

    pb.block_array = create_progressbar_image_array(pb, pb.block_max, block_list);
    pb.blockhl_array = create_progressbar_image_array(pb, pb.block_max, blockhl_list);
}

function pb_reset_blocks(pb)
{
    let index = 0, id = 0;;
    let last_index = 0;
    let last_element = 0;

    last_index = pb.block_total - 1;
    last_element = pb.block_max - 1;

    for (index = 0; index < pb.block_total; index++)
    {
        id = index;
        if (id == last_index) id = last_element;

        pb.block_array[id].style.display = "block";
        pb.blockhl_array[id].style.display = "block";

        pb.block_array[id].style.zIndex = 3;
        pb.blockhl_array[id].style.zIndex = 2;
    }
}

function set_progressbar_blocks(pb, x)
{
    let index = 0, id = 0, total = 0;
    let last_index = 0;
    let last_element = 0;

    x-= PROGRESSBAR_LEFT;

    total = Math.trunc((x + SLIDER_W)/PROGRESSBAR_BLOCK_W);

    if (total > pb.block_total)
        total = pb.block_total;

    pb_disable_blocks(pb);
    pb_reset_blocks(pb)

    last_index = pb.block_total - 1;
    last_element = pb.block_max - 1;

    for (index = 0; index < total; index++)
    {
        id = index;
        if (id == last_index) id = last_element;

        pb.block_array[id].style.zIndex = 2;
        pb.blockhl_array[id].style.zIndex = 3;
    }
}

function pb_disable_ticks(pb)
{
    if (pb.tick_array == null) return;

    let index = 0;
    for (index = 0; index < pb.tick_max; index++)
    {
        pb.tick_array[index].style.display = "none";
        pb.tickhl_array[index].style.display = "none";
 
        pb.tick_array[index].style.zIndex = -999;
        pb.tickhl_array[index].style.zIndex = -999;
    }
}

function pb_reset_ticks(pb)
{
    if (pb.tick_array == null) return;

    let index = 0;
    for (index = 0; index < pb.tick_total; index++)
    {
        pb.tick_array[index].style.display = "none";
        pb.tickhl_array[index].style.display = "none";
 
        pb.tick_array[index].style.zIndex = 1;
        pb.tickhl_array[index].style.zIndex = 0;
    }
}

function set_progressbar_tick(pb, x)
{
    if (pb.tick_array == null) return;
    if (pb.tick_spacing_array == null) return;

    let index = 0;
    let width = 0, y = 0;

    pb_disable_ticks(pb);
    pb_reset_ticks(pb);

    width = PROGRESSBAR_TICK_W;
    x+= (SLIDER_W/2);
    x = Math.trunc(x);

    for (index = 0; index < pb.tick_total; index++)
    {
        if (pb.tick_enabled_array[index] == 0)
            continue;

        y = x - pb.tick_spacing_array[index];

        if (y <= width && y >= -width)
        {
            pb.tick_array[index].style.zIndex = 0;
            pb.tickhl_array[index].style.zIndex = 1;
        }

        pb.tick_array[index].style.display = "block";
        pb.tickhl_array[index].style.display = "block"; 
    }
}

function pb_current_tick(pb, x)
{
    let index = 0;

    for (index = 0; index < pb.tick_total; index++)
    {
       if (x >= pb.tick_spacing_array[pb.tick_total-1-index])
           return pb.tick_total-1-index;
    }

    return -1;
}

function pb_next_tick(pb, id)
{
    let index = 0;

    for (index = 0; index < pb.tick_total; index++)
    {
       if (index > id)
           if (pb.tick_enabled_array[index] == 1)
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

       if (pb.tick_enabled_array[index] == 1)
           previous_index = index;
    }

    return -1;
}

function snap_progressbar_slider(pb, x)
{
    if (pb.tick_total == 0) return;

    let index = 0;
    let width = 0;
    let previous_index = 0, next_index = 0;
    let tick_spacing = 0;
    let last_index = pb.tick_total - 1;

    x+= Math.trunc(SLIDER_W/2);
    tick_spacing = pb.tick_spacing_array;

    index = pb_current_tick(pb, x);

    if (pb.tick_enabled_array[index] == 0)
        index = pb_previous_tick(pb, index);

    if (index == -1)
        index = pb_next_tick(pb, index);

    next_index = pb_next_tick(pb, index);

    if (x >= tick_spacing[index])
    {
        width = tick_spacing[next_index] - tick_spacing[index];
        width = Math.trunc(width/2);

        if (x >= tick_spacing[index] + width)
        {
            pb.tick = next_index;
            pb_update(pb);
            return;
        }
    }

    pb.tick = index;
    pb_update(pb);
}

function set_progressbar_pointer(pb, x)
{
    let width = 0;

    x-= Math.trunc(SLIDER_W/2);
    width = pb.width + SLIDER_RIGHT;

    if (x < SLIDER_LEFT)
        x = SLIDER_LEFT;
    else if (x > width)
        x = width;

    pb.x = x;
    pb.slider.style.left = x + "px";
    pb.slider.style.display = "block";

    set_progressbar_tick(pb, x);
    set_progressbar_blocks(pb, x);
}

function pb_pointer_tick(pb)
{
    let pointer_x = 0;
    let pointer_tick = 0;

    pointer_x = pb.x;
    pointer_x+= (SLIDER_W/2) + PROGRESSBAR_TICK_W;

    pointer_tick = pb_current_tick(pb, pointer_x);
    if (pointer_tick == -1) return -1;

    if (pb.tick_enabled_array[pointer_tick] == 0)
        pointer_tick = pb_previous_tick(pb, pointer_tick);

    if (pointer_tick == -1)
        pointer_tick = pb_next_tick(pb, pointer_tick);

    return pointer_tick;
}

function pb_update_pointer(pb)
{
    if (pb.tick_spacing_array == null) return;

    let x = 0;

    x = pb.tick_spacing_array[pb.tick];

    x+= Math.trunc(PROGRESSBAR_TICK_W/2);
    x-= Math.trunc(SLIDER_W/2);

    pb.slider.style.left = x + "px";
    pb.slider.style.display = "block";

    pb.x = x;
}

function pb_listener_pointer_down(event, pb)
{
    if (pb.active == 1) return;

    pb.active = 1;
    pb.container_x = pb.container.getBoundingClientRect().left;

    event.preventDefault();
}

function pb_listener_pointer_move(event, pb, x)
{
    if (pb.active == 0) return;

    let width = 0;
    let relatitve_x = 0;

    width = pb.container_x + PROGRESSBAR_LEFT + pb.width;

    if (x < pb.container_x) 
        x = pb.container_x;
    else if (x > width)
        x = width;

    relative_x = x - pb.container_x;

    set_progressbar_pointer(pb, relative_x);
    if (pb.handler != null) pb.handler(PB_HOVER, pb);
}

function pb_listener_pointer_up(event, pb)
{
    if (pb.active == 0) return;
    if (pb.active == 1) pb.active = 0;

    snap_progressbar_slider(pb, pb.x);
    if (pb.handler != null) pb.handler(PB_DROP, pb);
}

function pb_update(pb)
{
    pb_update_pointer(pb);

    set_progressbar_tick(pb, pb.x);
    set_progressbar_blocks(pb, pb.x);

    if (pb.handler != null) pb.handler(PB_UPDATE, pb);
}

function pb_resize(pb)
{
    if (pb.container == null) return;

    pb.width = pb.container.getBoundingClientRect().width;
    pb.width-= PROGRESSBAR_LEFT;

    pb_update_blocks(pb);
    pb_update_ticks(pb);

    pb_update(pb);
}

function pb_listener_resize(event, pb)
{
    pb_resize(pb);
}

function pb_set_event_listeners(pb)
{
    let interval = null;

    pb.slider.addEventListener("mousedown", (event) => {
        pb_listener_pointer_down(event, pb); });

    window.addEventListener("mousemove", (event) => {
        pb_listener_pointer_move(event, pb, event.clientX); });

    window.addEventListener("mouseup", (event) => {
       pb_listener_pointer_up(event, pb); });

    pb.slider.addEventListener("touchstart", (event) => {
        pb_listener_pointer_down(event, pb); });

    window.addEventListener("touchmove", (event) => {
        pb_listener_pointer_move(event, pb, event.changedTouches[0].clientX); });

    window.addEventListener("touchend", (event) => {
       pb_listener_pointer_up(event, pb); });

    window.addEventListener("touchcancel", (event) => {
       pb_listener_pointer_up(event, pb); });

    window.addEventListener("resize", (event) => {
        pb_listener_resize(event, pb); });

    interval = setInterval(() => {

        if (pb.resource_index == pb.resource_total)
        if (pb.container.getBoundingClientRect().width != 0)
        {
            pb_resize(pb);
            clearInterval(interval);
        }

    }, 1000);
}

function create_progressbar(parent_id, width, tick_total, tick_list, instance, handler)
{
    let container = document.getElementById(parent_id);
    let pb = new t_progressbar();
    let interval = null;

    container.style.position = "relative";
    container.style.height = PROGRESSBAR_TICK_H + "px";

    pb.parent_id = parent_id;
    pb.container = container;
    pb.instance = instance;
    pb.handler = handler;

    pb.max_width = width;
    pb.width = 0;

    pb.tick_max = tick_total
    pb.tick_total = tick_total;

    pb_create_ticks(pb, tick_list);
    pb_create_blocks(pb);
    pb.slider = create_pointer_resource(pb);

    pb_disable_ticks(pb);
    pb_disable_blocks(pb);
    pb.slider.style.display = "none";
 
    pb_set_event_listeners(pb)

    return pb;
}
