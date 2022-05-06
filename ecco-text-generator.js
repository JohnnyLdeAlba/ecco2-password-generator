function get_sequence(config)
{
    if (config.CLIP_TOTAL == 0)
        return null;

    sequence = new Array();
    
    var index;
    for (index = 0; index < config.CLIP_TOTAL; index++)
    {
        sequence[index] = new t_sequence();
        sequence[index].id = config.CLIP_OFFSET + index;
    }

    return sequence;
}

function get_wave_generator(config)
{
    let table_total = 13;
    let table = config.EffectResource;

    let mode = SINEWAVE_TABLE_ID;
    let offset = RIPPLE_TABLE_ID;
    let index;

    for (index = 0; index < table_total; index++)
    {
        if (config.EFFECT == table[(index * 3)])
        {
            mode = table[(index * 3) + 1];
            offset = table[(index * 3) + 2];
        }
    }
    
    return create_wave_generator(mode, offset);
}

function t_text_generator()
{
    this.config = null;
    this.cmp = null;

    this.program_counter = 0;
    this.frame_counter = 0;
    this.delay_total = 0;

    this.display = null;

    this.raw_string = "";
    this.string = null;

    this.frame = 0;
    this.delay = 0;

    this.font = null;
    this.clip = null;
    this.background = null;

    this.sequence = null;

    this.resource = null;
    this.resource_index = 0;
    this.resource_total = 0;
    this.theme_total = 0;

    return;
}

function enable_display(text_generator)
{
    text_generator.resource_index++;

    if (text_generator.resource_index == text_generator.resource_total)
    {
        text_generator.program_counter = (1000 | 0x8000);
        text_generator.frames_per_second = 60;    

       // text_generator_set_output(text_generator, ""); // DEBUG;
       tg_handler_update_frame(text_generator);
    }
}

// Needs to be fixed (Resource).

function get_resources(text_generator)
{
    let config = text_generator.config;
    let index;

    text_generator.theme_total = 8; // DEBUG
    text_generator.resource_total = 17;

    text_generator.font = new Array();
    text_generator.background = new Array();

    for (index = 0; index < text_generator.theme_total; index++)
    {
        text_generator.font[index] = new Image();    
        text_generator.font[index].src = config.RESOURCES_DIR
            + config.ThemeResource[(index * 3) + 1];
    
        text_generator.font[index].addEventListener(
            'load', () => { enable_display(text_generator); });

        text_generator.background[index] = new Image();    
        text_generator.background[index].src = config.RESOURCES_DIR
            + config.ThemeResource[(index * 3) + 2];

        text_generator.background[index].addEventListener(
            'load', () => { enable_display(text_generator); });
    }

    text_generator.clip = new Image();    
    text_generator.clip.src = text_generator.config.RESOURCES_DIR 
        + text_generator.config.CLIP_FILENAME;

    text_generator.clip.addEventListener(
        'load', () => { enable_display(text_generator); });
}

function create_text_generator()
{
    let text_generator = new t_text_generator();
    let config = create_default_h_config();

    text_generator.cmp = new t_composition();

    text_generator.config = config;
    text_generator.sequence = get_sequence(config);

    get_character_record(config, text_generator.cmp);
    get_clip_record(config, text_generator.cmp);

    return text_generator;
}

function init_text_generator(text_generator)
{
    text_generator.display = document.getElementById('display');
    get_resources(text_generator);
}

function update_display_background(text_generator)
{
    let config = text_generator.config;

    let context = null;
    let background = null;

    let wg = null;
    let offset_table = null;

    let index = text_generator.frame * text_generator.config.FRAME_SKIP;
    let line = 0;

    context = text_generator.display.getContext('2d');
    context.imageSmoothingEnabled = false;

    if (config.EFFECT == EFFECT_TRANSPARENT)
    {
        context.clearRect(
            0, 
            0, 
            text_generator.display.width,
            text_generator.display.height);

        return;
    }

    wg = get_wave_generator(config);

    offset_table = process_wave_generator(wg, index);

    for (line = 0; line < 240; line++)
        context.drawImage(
            text_generator.background[config.THEME - THEME_DEFAULT], 
            0, line, 384, 1,
	    offset_table[line], line, 384, 1);

    if (text_generator.frame > 255) text_generator.frame = 0;
    else text_generator.frame++;

    return;
}

// update composition?
function text_generator_set_output(text_generator, raw_string)
{
    let config = text_generator.config;

    let string = "";

    let cmp = new t_composition();

    text_generator.raw_string = raw_string;

    cmp.character = text_generator.cmp.character;
    cmp.clip = text_generator.cmp.clip;

    string = text_filter_default(raw_string);

    get_word_record(config, cmp, string);
    get_line_record(config, cmp);

    if (cmp.block_h > config.IMAGE_HEIGHT - config.PADDING * 2)
    {
        cmp = null;
        cmp = text_generator.cmp;
    }

    else
    {
       text_generator.cmp = null;
       text_generator.cmp = cmp;

       text_generator.raw_string = raw_string;
       text_generator.string = string;
    }

    update_display(text_generator);
}

function update_display(text_generator)
{
    if (text_generator.resource_index < text_generator.resource_total)
        return;
    
    if (text_generator.delay > 255) text_generator.delay = 0;
    else text_generator.delay++;

    if (text_generator.delay % text_generator.config.FRAME_SKIP != 0)
         return;

    let plot_state = new t_plot_state();

    plot_state.background = text_generator.display;
    plot_state.font = text_generator.font[text_generator.config.THEME - THEME_DEFAULT];
    plot_state.clip = text_generator.clip;
    plot_state.sequence = text_generator.sequence;
    plot_state.string = text_generator.string;

    update_display_background(text_generator);
    plot_block(text_generator.config, plot_state, text_generator.cmp);
}

// need to update ecco text generator main
function tg_handler_update_frame(tg)
{
    if (tg.resource_index != tg.resource_total)
    {
        requestAnimationFrame(() => { tg_handler_update_frame(tg); });
        return;
    }

    if (tg.program_counter & 0x8000)
    {
        tg.program_counter&= 0x7fff;

        // console.log(tg.program_counter);
        // console.log(tg.frame_counter);

        if (tg.frames_per_second != 60)
            tg.delay_total = tg.program_counter/tg.frames_per_second;

        tg.program_counter = 0;
        tg.frame_counter = 0;

        setTimeout(() => { tg.program_counter|= 0x8000; }, 1000);
    }

    tg.program_counter++;

    if ((tg.program_counter & 0x7fff) >= (tg.frame_counter * tg.delay_total))
    {
        update_display(tg);
        tg.frame_counter++;
 
        requestAnimationFrame(() => { tg_handler_update_frame(tg); });
        return;
    }
    
    requestAnimationFrame(() => { tg_handler_update_frame(tg); });
}


