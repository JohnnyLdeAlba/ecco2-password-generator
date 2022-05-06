const GENESIS_NTSC_FPS = 59.922751013551
const MEGADRIVE_PAL_FPS = 49.701460119948;

const ECCO1_RAWTIME_SECOND = 64;

function t_ecco1_session()
{
    this.mode = ECCO1_MEGADRIVE;

    this.scenario_id = 0;
    this.scenario_key = "";
    this.scenario_name = "";

    this.stage_index = 0;
    this.stage_id = 0;
    this.stage_key = "";
    this.stage_name = "";
    this.stage_description = "";

    this.stage_event = 0;
    this.stage_event_key = "";
    this.stage_event_name = "";

    this.stage_caption = "";
    this.stage_theme = 0;

    this.globe_obtained = 0;
    this.globe_obtained_key = "";
    this.globe_obtained_name = "";

    this.unlimited_air = 0;
    this.charge_sonar = 0;
    this.perma_kill = 0;

    this.death_counter = 7;
    this.death_counter_key = "";
    this.death_counter_name = "";

    this.cheat_mode = 0;
    this.time_elapsed_hours = 0;
    this.time_elapsed_minutes = 0;
    this.time_elapsed_seconds = 0;
    this.time_elapsed_total_seconds = 0;
    this.time_elapsed = 0;
    this.frames_per_second = 0;

    this.password = "";
    this.password_suggestion = "";
    this.unencrypted_data = 0;

    this.debug_mode = 0;
    this.developer_mode = 1;

    this.error_id = 0;
}

function disable_all_panels()
{
    let table = [
        "panel_game",
        "panel_about",
        "panel_keypad_alpha",
        "panel_keypad_numeric",
        "panel_ecco1_scenarios",
        "panel_ecco1md_goat",
        "panel_ecco1_stage",
        "panel_ecco1jpmd_stage",
        "panel_ecco1cd_stage",
        "panel_ecco1_stage_event",
        "panel_ecco1_globe_obtained",
        "panel_ecco1_death_counter",
        "panel_ecco1",
        "panel_ecco2",
        "panel_ecco2_stage",
        "panel_ecco2_difficulty",
        "panel_ecco2_decoder"
    ];

    let index = 0;

    for (index = 0; index < table.length; index++)
        set_block_visibility(table[index], 0);
}

// BEGIN ECCO THE DOLPHIN PASSWORD VALIDATION

function invalid_ecco1_password_default(instance)
{
    let session = instance.ecco1_session;
    let output = "";

    if (session.error_id == ECCO_INVALIDPASS_ALPHAONLY)
    {
        output+= _white(" * Passwords can only contain ");
        output+= _yellow("Letters");
        output+= _white("\n   and ");
        output+= _yellow("Spaces");
        output+= _white(".\n\n\n");

        session.stage_description+= output;
        return -1;
    }
    else if (session.error_id == ECCO_INVALIDPASS_CHECKSUM)
    {
        output+= _white(" * The ");
        output+= _yellow("Password Checksum");
        output+= _white(" is invalid.\n");
        output+= _white(" * Use the ");
        output+= _yellow("Suggested Password");
        output+= _white(" to\n   correct this.\n\n\n"); 

        session.stage_description+= output;
        return -1;
    }

    if (instance.version == ECCO1_MEGADRIVE)
    {
        if ((session.stage_event == ECCO1_STORM_VORTEX) && (session.unlimited_air == 0))
        {
            output+= _white(" * ");
            output+= _yellow("Unlimited Air");
            output+= _white(" must be enabled when\n   the Stage Event is set to ");
            output+= _yellow("The\n   Storm Sends Ecco to The Tube");
            output+= _white(".\n\n\n");

            session.stage_description+= output;
            return -1;
        }
    }

    return 0;
}

function invalid_ecco1_password_stage_event(instance, default_stage_id)
{
    let session = instance.ecco1_session;
    let output = "";

    if (default_stage_id & ECCO1_TMACHINE_JURASSIC)
    {
        if ((session.stage_id & ECCO1_TMACHINE_JURASSIC) == 0)
        {
            output+= _white(" * ");
            output+= _yellow("Stage Event");
            output+= _white(" must be set to ");
            output+= _yellow("Time\n   Machine Sends Ecco to Jurassic\n   Beach");
            output+= _white(".\n");
        }
    }
    else if (default_stage_id & ECCO1_TMACHINE_HOMEBAY)
    {
        if ((session.stage_id & ECCO1_TMACHINE_HOMEBAY) == 0)
        {
            output+= _white(" * ");
            output+= _yellow("Stage Event");
            output+= _white(" must be set to ");
            output+= _yellow("Time\n   Machine Sends Ecco to Home Bay");
            output+= _white(".\n");
        }
    }
    else if (default_stage_id & ECCO1_STORM_VORTEX)
    {
        if ((session.stage_id & ECCO1_TMACHINE_HOMEBAY) == 0)
        {
            output+= _white(" * ");
            output+= _yellow("Stage Event");
            output+= _white(" must be set to ");
            output+= _yellow("The Storm\n   Sends Ecco to The Tube");
            output+= _white(".\n");
        }
    }

    session.stage_description+= output;
}

function invalid_ecco1_password_globe_obtained(instance, default_stage_id)
{
    let session = instance.ecco1_session;
    let output = "";

    if (default_stage_id & ECCO1_GLOBE_OBTAINED_DEFAULT_MASK)
    {
        if ((session.stage_id & ECCO1_GLOBE_OBTAINED_DEFAULT_MASK) == 0)
        {
            output+= _white(" * ");
            output+= _yellow("Globe Obtained");
            output+= _white(" must be set to ");
            output+= _yellow("Red") + _white(",\n   ") + _yellow("Brown") + _white(", ");
            output+= _yellow("Purple") + _white(" or ") + _yellow("Green");
            output+= _white(" only.\n");
        }
    }
    else if ((default_stage_id & ECCO1_GLOBE_OBTAINED_DEFAULT_MASK) == 0)
    {
        if (session.stage_id & ECCO1_GLOBE_OBTAINED_MASK)
        {
            output+= _white(" * ");
            output+= _yellow("Globe Obtained");
            output+= _white(" must be set to ");
            output+= _yellow("No\n   Globe Obtained");
            output+= _white(".\n");
        }
    }

    session.stage_description+= output;
}

function invalid_ecco1_password_special_abilities(instance, default_stage_id, flags)
{
    let session = instance.ecco1_session;
    let output = "";

    if (default_stage_id & ECCO1_UNLIMITED_AIR)
    {
        if ((session.stage_id & ECCO1_UNLIMITED_AIR) == 0)
        {
            output+= _white(" * ");
            output+= _yellow("Unlimited Air");
            output+= _white(" must be enabled.\n");
        }
    }
    else if ((default_stage_id & ECCO1_UNLIMITED_AIR) == 0)
    {
        if (session.stage_id & ECCO1_UNLIMITED_AIR)
        {
            output+= _white(" * ");
            output+= _yellow("Unlimited Air");
            output+= _white(" must be disabled.\n");
        }
    }

    if (flags & ECCO1_CHARGE_SONAR)
    if ((default_stage_id & ECCO1_CHARGE_SONAR) == 0)
    {
        if (session.stage_id & ECCO1_CHARGE_SONAR)
        {
            output+= _white(" * ");
            output+= _yellow("Charge Sonar");
            output+= _white(" must be disabled.\n");
        }
    }

    if (flags & ECCO1_PERMA_KILL)
    if ((default_stage_id & ECCO1_PERMA_KILL) == 0)
    {
        if (session.stage_id & ECCO1_PERMA_KILL)
        {
            output+= _white(" * ");
            output+= _yellow("Permanent Kill");
            output+= _white(" must be disabled.\n");
        }
    }

    session.stage_description+= output;
}

function invalid_ecco1_password(instance, flags)
{
    let session = instance.ecco1_session;
    let version = session.mode;

    let default_stage_id = 0;
    let output = "";

    session.stage_name = "";
    session.stage_caption = "ecco1_caption_title_screen";
    session.stage_theme = THEME_DEFAULT;

    output = _red("Invalid Password\nfor " + get_ecco1_stage_name(session.stage_index, version));
    output+= _white("\n\n\u8001");

    session.stage_description = output;

    if (invalid_ecco1_password_default(instance) < 0)
    {
        output = _white("\u8000");
        session.stage_description+= output;
        session.password= _red(session.password);

        return -1;
    }

    default_stage_id = get_ecco1_stage_id(session.stage_index, instance.version, 1);

    invalid_ecco1_password_stage_event(instance, default_stage_id);
    invalid_ecco1_password_globe_obtained(instance, default_stage_id);
    invalid_ecco1_password_special_abilities(instance, default_stage_id, flags)

    output = _white("\n\n");
    output+= _white("\u8000");
    session.stage_description+= output;
    session.password= _red(session.password);

    return 0;
}

// END ECCO THE DOLPHIN PASSWORD VALIDATION
// BEGIN ECCO THE DOLPHIN MEGA DRIVE/GENESIS

function get_ecco1md_table_stage_menu()
{
    let table = [
        "menu_ecco1md_stage_01",
        "menu_ecco1md_stage_02",
        "menu_ecco1md_stage_03",
        "menu_ecco1md_stage_04",
        "menu_ecco1md_stage_05",
        "menu_ecco1md_stage_06",
        "menu_ecco1md_stage_07",
        "menu_ecco1md_stage_08",
        "menu_ecco1md_stage_09",
        "menu_ecco1md_stage_10",
        "menu_ecco1md_stage_11",
        "menu_ecco1md_stage_12",
        "menu_ecco1md_stage_13",
        "menu_ecco1md_stage_14",
        "menu_ecco1md_stage_15",
        "menu_ecco1md_stage_16",
        "menu_ecco1md_stage_17",
        "menu_ecco1md_stage_18",
        "menu_ecco1md_stage_19",
        "menu_ecco1md_stage_20",
        "menu_ecco1md_stage_21",
        "menu_ecco1md_stage_22",
        "menu_ecco1md_stage_23",
        "menu_ecco1md_stage_24",
        "menu_ecco1md_stage_25",
        "menu_ecco1md_stage_26"
    ];

    return table;
}

function get_ecco1md_table_stage_id(flags)
{
    let index = 0;
    let table = [
        -1,
        ECCO1_SELECTIONSCR,
        ECCO1_UNDERCAVES,
        ECCO1_THEVENTS,
        ECCO1_THELAGOON,
        ECCO1_RIDGEWATER,
        ECCO1_OPENOCEAN1,
        ECCO1_ICEZONE,
        ECCO1_HARDWATER,
        ECCO1_COLDWATER,
        ECCO1_ISLANDZONE,
        ECCO1_DEEPWATER1,
        ECCO1_THEMARBLESEA,
        ECCO1_THELIBRARY,
        ECCO1_DEEPCITY,
        ECCO1_CITYOFFOREVER1,
        ECCO1_JURASSICBEACH,
        ECCO1_PTERANODONPOND,
        ECCO1_ORIGINBEACH,
        ECCO1_TRILOBITECIRCLE,
        ECCO1_DARKWATER,
        ECCO1_DEEPWATER2,
        ECCO1_CITYOFFOREVER2,
        ECCO1_THETUBE,
        ECCO1_THEMACHINE,
        ECCO1_THELASTFIGHT
    ];

    if (flags == 0)
    {
        for (index = 0; index < table.length; index++)
            table[index]&= ECCO1_MASK_STAGEID;
            // table[index]&= (ECCO1_MASK_STAGEID | ECCO1_STAGE_EVENT_MASK);
    }

    return table;
}

function get_ecco1md_table_stage_name()
{
    let table = [
        -1,
	"Selection Screen",
	"Undercaves",
	"The Vents",
	"The Lagoon",
	"Ridge Water",
	"Open Ocean",
	"Ice Zone",
	"Hard Water",
	"Cold Water", 
	"Island Zone",
	"Deep Water",
	"The Marble Sea",
	"The Library",
	"Deep City",
	"City of Forever",
	"Jurassic Beach",
	"Pteranodon Pond",
	"Origin Beach",
	"Trilobite Circle",
	"Dark Water",
	"Deep Water",
	"City of Forever",
	"The Tube",
	"Welcome to the Machine",
	"The Last Fight"
    ];
	
    return table;
}

function get_ecco1md_table_stage_description()
{
    let table = [
        -1,
        -1,
        "(s)A deep maze of caverns with no surface to the dry side. Songs of the sea sing of a giant danger in this place.\n\n(l)",
        "(s)Giant cracks in the ocean floor have strong upward currents of warm water. After the storm, songs of three trapped dolphins are heard here...\n\n(l)",
        "(s)The songs of the sea sing of the stone eating stars that live in this place. A dolphin sings for her trapped pod.\n\n(l)",
        "(s)Two cold water ponds connected by a maze of shell and stone. To pass ridge water one must have great knowledge of the sea.\n\n(l)",
        "(s)\nThe open ocea is cold and dangerous.\n\n\n(l)",
        "(s)Dark cold waters with few places to breath. Strange cold water creatures live in this place. Distant songs are heard but not understood.\n\n(l)",
        "(s)Water turns to slippery stone from the dark cold. There is great danger when the water stones move. The distant songs continue...\n\n(l)",
        "(s)Quiet songs of wisdom sing about the hard water called ice. The big blue is near.\n\n(l)",
        "(s)\nSeven islands in warmer waters.\n\n\n(l))",
        "(s)Ancient breathless passages run so deep that no songs of this place have yet been sung.\n\n(l)",
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
     ];

    return table;
}

function get_ecco1md_table_stage_caption()
{
    let table = [
        -1,
        "ecco1_caption_selection_scr",
        "ecco1_caption_undercaves",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_ice_zone",
        "ecco1_caption_ice_zone",
        "ecco1_caption_big_blue",
        "ecco1_caption_home_bay",
        "ecco1_caption_deep_water",
        "ecco1_caption_atlantis",
        "ecco1_caption_the_library",
        "ecco1_caption_atlantis",
        "ecco1_caption_city_of_forever",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_dark_water",
        "ecco1_caption_deep_water",
        "ecco1_caption_city_of_forever",
        "ecco1_caption_the_tube",
        "ecco1_caption_the_machine",
        "ecco1_caption_the_last_fight"
    ];

    return table;
}

function get_ecco1md_table_stage_theme()
{
    let table = [
        -1,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_THE_MACHINE,
        THEME_THE_MACHINE,
        THEME_THE_LAST_FIGHT
    ];

    return table;
}

// END ECCO THE DOLPHIN MEGA DRIVE/GENESIS
// BEGIN ECCO THE DOLPHIN JAPANESE VERSION

function get_ecco1jpmd_table_stage_menu()
{
    let table = [
        "menu_ecco1jpmd_stage_01",
        "menu_ecco1jpmd_stage_02",
        "menu_ecco1jpmd_stage_03",
        "menu_ecco1jpmd_stage_04",
        "menu_ecco1jpmd_stage_05",
        "menu_ecco1jpmd_stage_06",
        "menu_ecco1jpmd_stage_07",
        "menu_ecco1jpmd_stage_08",
        "menu_ecco1jpmd_stage_09",
        "menu_ecco1jpmd_stage_10",
        "menu_ecco1jpmd_stage_11",
        "menu_ecco1jpmd_stage_12",
        "menu_ecco1jpmd_stage_13",
        "menu_ecco1jpmd_stage_14",
        "menu_ecco1jpmd_stage_15",
        "menu_ecco1jpmd_stage_16",
        "menu_ecco1jpmd_stage_17",
        "menu_ecco1jpmd_stage_18",
        "menu_ecco1jpmd_stage_19",
        "menu_ecco1jpmd_stage_20",
        "menu_ecco1jpmd_stage_21",
        "menu_ecco1jpmd_stage_22",
        "menu_ecco1jpmd_stage_23",
        "menu_ecco1jpmd_stage_24",
        "menu_ecco1jpmd_stage_25",
        "menu_ecco1jpmd_stage_26",
        "menu_ecco1jpmd_stage_27",
        "menu_ecco1jpmd_stage_28"
    ];

    return table;
}

function get_ecco1jpmd_table_stage_id(flags)
{
    let table = [
        -1,
        ECCO1JPMD_SELECTIONSCR,
        ECCO1JPMD_UNDERCAVES,
        ECCO1JPMD_THEVENTS,
        ECCO1JPMD_THELAGOON,
        ECCO1JPMD_RIDGEWATER,
        ECCO1JPMD_OPENOCEAN1,
        ECCO1JPMD_ICEZONE,
        ECCO1JPMD_HARDWATER,
        ECCO1JPMD_COLDWATER,
        ECCO1JPMD_OPENOCEAN2,
        ECCO1JPMD_ISLANDZONE,
        ECCO1JPMD_DEEPWATER1,
        ECCO1JPMD_THEMARBLESEA,
        ECCO1JPMD_THELIBRARY,
        ECCO1JPMD_DEEPCITY,
        ECCO1JPMD_CITYOFFOREVER1,
        ECCO1JPMD_JURASSICBEACH,
        ECCO1JPMD_PTERANODONPOND,
        ECCO1JPMD_ORIGINBEACH,
        ECCO1JPMD_TRILOBITECIRCLE,
        ECCO1JPMD_DARKWATER,
        ECCO1JPMD_DEEPWATER2,
        ECCO1JPMD_CITYOFFOREVER2,
        ECCO1JPMD_THETUBE,
        ECCO1JPMD_THEMACHINE,
        ECCO1JPMD_THESTOMACH,
        ECCO1JPMD_THELASTFIGHT
    ];

    if (flags == 0)
    {
        for (index = 0; index < table.length; index++)
            table[index]&= ECCO1_MASK_STAGEID | ECCO1_STAGE_EVENT_MASK;
    }

    return table;
}

function get_ecco1jpmd_table_stage_name()
{
    let table = 
    [
        -1,
        "Selection Screen",
	"Undercaves",
	"The Vents",
	"The Lagoon",
	"Ridge Water",
	"Open Ocean",
	"Ice Zone",
	"Hard Water",
	"Cold Water", 
	"Open Ocean",
	"Island Zone",
	"Deep Water",
	"The Marble Sea",
	"The Library",
	"Deep City",
	"City of Forever",
	"Jurassic Beach",
	"Pteranodon Pond",
	"Origin Beach",
	"Trilobite Circle",
	"Dark Water",
	"Deep Water",
	"City of Forever",
	"The Tube",
	"Welcome to the Machine",
	"The Stomach",
	"The Last Fight"
    ];

    return table;
}

function get_ecco1jpmd_table_stage_description()
{ 
    let table = [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
     ];


    return table;
}

function get_ecco1jpmd_table_stage_caption()
{
    let table = [
        -1,
        "ecco1_caption_selection_scr",
        "ecco1_caption_undercaves",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_ice_zone",
        "ecco1_caption_ice_zone",
        "ecco1_caption_big_blue",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_deep_water",
        "ecco1_caption_atlantis",
        "ecco1_caption_the_library",
        "ecco1_caption_atlantis",
        "ecco1_caption_city_of_forever",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_dark_water",
        "ecco1_caption_deep_water",
        "ecco1_caption_city_of_forever",
        "ecco1_caption_the_tube",
        "ecco1_caption_the_machine",
        "ecco1_caption_the_stomach",
        "ecco1_caption_the_last_fight"
    ];

    return table;
}

function get_ecco1jpmd_table_stage_theme()
{
    let table = [
        -1,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_THE_MACHINE,
        THEME_THE_MACHINE,
        THEME_THE_MACHINE,
        THEME_THE_LAST_FIGHT
    ];

    return table;
}

function validate_ecco1jpmd_deepwater2(instance)
{
    let session = instance.ecco1_session;
    let version = session.mode;

    let stage_id = 0;
    let current_stage_id = 0;

    stage_id = ECCO1JPMD_DEEPWATER2 & (ECCO1_MASK_STAGEID | ECCO1_TMACHINE_HOMEBAY);
    current_stage_id = session.stage_id & (ECCO1_MASK_STAGEID | ECCO1_TMACHINE_HOMEBAY);

    if (current_stage_id != stage_id)
        return 1;

    stage_id = get_ecco1_stage_id(session.stage_index, version, 1);
    stage_id&= ~(ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL);
    stage_id|= ECCO1_GLOBE_OBTAINED_DEFAULT_MASK;        

    current_stage_id = session.stage_id & ~(ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL);
    if (current_stage_id & ECCO1_GLOBE_OBTAINED_DEFAULT_MASK)
        current_stage_id|= ECCO1_GLOBE_OBTAINED_DEFAULT_MASK;

    if (current_stage_id == stage_id)
        return 0;

    invalid_ecco1_password(instance);
    return -1;
}

function validate_ecco1jpmd_password(instance)
{
    let session = instance.ecco1_session;
    let version = session.mode;

    let current_stage_id = 0;
    let stage_id = 0;

    let result = 0;

    if (session.error_id < 0)
    {
        invalid_ecco1_password(instance, 0);
        return -1;
    }

    result = validate_ecco1jpmd_deepwater2(instance);
    if (result == 0 || result == -1) return result;

    current_stage_id = session.stage_id & ~(ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL);

    stage_id = get_ecco1_stage_id(session.stage_index, version, 1);
    stage_id&= ~(ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL);

    if (current_stage_id == stage_id)
        return 0;

    invalid_ecco1_password(instance, 0);
    return -1;
}

// BEGIN ECCO THE DOLPHIN JAPANESE VERSION
// BEGIN ECCO THE DOLPHIN SEGA CD

function get_ecco1cd_table_stage_menu()
{
    let table = [
        "menu_ecco1cd_stage_01",
        "menu_ecco1cd_stage_02",
        "menu_ecco1cd_stage_03",
        "menu_ecco1cd_stage_04",
        "menu_ecco1cd_stage_05",
        "menu_ecco1cd_stage_06",
        "menu_ecco1cd_stage_07",
        "menu_ecco1cd_stage_08",
        "menu_ecco1cd_stage_09",
        "menu_ecco1cd_stage_10",
        "menu_ecco1cd_stage_11",
        "menu_ecco1cd_stage_12",
        "menu_ecco1cd_stage_13",
        "menu_ecco1cd_stage_14",
        "menu_ecco1cd_stage_15",
        "menu_ecco1cd_stage_16",
        "menu_ecco1cd_stage_17",
        "menu_ecco1cd_stage_18",
        "menu_ecco1cd_stage_19",
        "menu_ecco1cd_stage_20",
        "menu_ecco1cd_stage_21",
        "menu_ecco1cd_stage_22",
        "menu_ecco1cd_stage_23",
        "menu_ecco1cd_stage_24",
        "menu_ecco1cd_stage_25",
        "menu_ecco1cd_stage_26",
        "menu_ecco1cd_stage_27",
        "menu_ecco1cd_stage_28",
        "menu_ecco1cd_stage_29",
        "menu_ecco1cd_stage_30"
    ];

    return table;
}

function get_ecco1cd_table_stage_id(flags)
{
    let table = [
        -1,
        ECCO1CD_UNDERCAVES,
        ECCO1CD_THEVENTS,
        ECCO1CD_THELAGOON,
        ECCO1CD_RIDGEWATER,
        ECCO1CD_OPENOCEAN1,
        ECCO1CD_ICEZONE,
        ECCO1CD_HARDWATER,
        ECCO1CD_COLDWATER,
        ECCO1CD_ISLANDZONE,
        ECCO1CD_DEEPWATER1,
        ECCO1CD_DEEPGATE,
        ECCO1CD_SHIPGRAVESEA,
        ECCO1CD_WRECKTRAP,
        ECCO1CD_SEAOFSILENCE,
        ECCO1CD_VOLCANICREEF,
        ECCO1CD_THEMARBLESEA,
        ECCO1CD_THELIBRARY,
        ECCO1CD_DEEPCITY,
        ECCO1CD_CITYOFFOREVER1,
        ECCO1CD_JURASSICBEACH,
        ECCO1CD_PTERANODONPOND,
        ECCO1CD_ORIGINBEACH,
        ECCO1CD_TRILOBITECIRCLE,
        ECCO1CD_DARKWATER,
        ECCO1CD_DEEPWATER2,
        ECCO1CD_CITYOFFOREVER2,
        ECCO1CD_THETUBE,
        ECCO1CD_THEMACHINE,
        ECCO1CD_THELASTFIGHT
    ];

    let index = 0;

    if (flags == 0)
    {
        for (index = 0; index < table.length; index++)
            table[index]&= ECCO1_MASK_STAGEID | ECCO1_STAGE_EVENT_MASK;
    }

    return table;
}

function get_ecco1cd_table_stage_name()
{
    let table = [
        -1,
	"Undercaves",
	"The Vents",
	"The Lagoon",
	"Ridge Water",
	"Open Ocean",
	"Ice Zone",
	"Hard Water",
	"Cold Water", 
	"Island Zone",
	"Deep Water",
	"Deep Gate",
	"Ship Grave Sea",
	"Wreck Trap",
	"Sea of Silence",
	"Volcanic Reef",
	"The Marble Sea",
	"The Library",
	"Deep City",
	"City of Forever",
	"Jurassic Beach",
	"Pteranodon Pond",
	"Origin Beach",
	"Trilobite Circle",
	"Deep Water",
	"Deep Water",
	"City of Forever",
	"The Tube",
	"Welcome to the Machine",
        "The Last Fight"
    ];
	
    return table;
}

function get_ecco1cd_table_stage_description()
{
    table = [
        -1,
        "(s)A deep maze of caverns with no surface to the dry side. Songs of the sea sing of a giant danger in this place.\n\n(l)",
        "(s)Giant cracks in the ocean floor have strong upward currents of warm water. After the storm, songs of three trapped dolphins are heard here...\n\n(l)",
        "(s)The songs of the sea sing of the stone eating stars that live in this place. A dolphin sings for her trapped pod.\n\n(l)",
        "(s)Two cold water ponds connected by a maze of shell and stone. To pass ridge water one must have great knowledge of the sea.\n\n(l)",
        "(s)\nThe open ocea is cold and dangerous.\n\n\n(l)",
        "(s)Dark cold waters with few places to breath. Strange cold water creatures live in this place. Distant songs are heard but not understood.\n\n(l)",
        "(s)Water turns to slippery stone from the dark cold. There is great danger when the water stones move. The distant songs continue...\n\n(l)",
        "(s)Quiet songs of wisdom sing about the hard water called ice. The big blue is near.\n\n(l)",
        "(s)\nSeven islands in warmer waters.\n\n\n(l))",
        "(s)Ancient breathless passages run so deep that no songs of this place have yet been sung.\n\n(l)",
        "(s)Very few songs by singers who guard the entrance to the marble sea.\n\n(l)",
        "(s)\nBones of strange floating whales are found here, they are infested with dangerous fish.\n\n(l)",
        "(s)Dangerous caves with fierce currents. the turtles may help but not willingly\n\n(l)",
        -1,
        "(s)The sunken city if through the mountain of stone. Glyphs open passages in this place.\n\n(l)",
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
    ];

    return table;
}

function get_ecco1cd_table_stage_caption()
{
    let table = [
        -1,
        "ecco1_caption_undercaves",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_home_bay",
        "ecco1_caption_ice_zone",
        "ecco1_caption_ice_zone",
        "ecco1_caption_big_blue",
        "ecco1_caption_home_bay",
        "ecco1_caption_deep_water",
        "ecco1_caption_deep_gate",
        "ecco1_caption_deep_gate",
        "ecco1_caption_deep_gate",
        "ecco1_caption_deep_gate",
        "ecco1_caption_deep_gate",
        "ecco1_caption_atlantis",
        "ecco1_caption_the_library",
        "ecco1_caption_atlantis",
        "ecco1_caption_city_of_forever",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_dark_water",
        "ecco1_caption_deep_water",
        "ecco1_caption_city_of_forever",
        "ecco1_caption_the_tube",
        "ecco1_caption_the_machine",
        "ecco1_caption_the_last_fight"
    ];

    return table;
}

function get_ecco1cd_table_stage_theme()
{
    let table = [
        -1,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_JURASSIC_BEACH,
        THEME_DEFAULT,
        THEME_DEFAULT,
        THEME_THE_MACHINE,
        THEME_THE_MACHINE,
        THEME_THE_LAST_FIGHT
    ];

    return table;
}

function validate_ecco1cd_undercaves(instance)
{
    let session = instance.ecco1_session;
    let version = session.mode;

    let stage_id = 0;
    let current_stage_id = 0;

    stage_id = ECCO1CD_UNDERCAVES & ECCO1_MASK_STAGEID;
    current_stage_id = session.stage_id & ECCO1_MASK_STAGEID;

    if (current_stage_id != stage_id)
        return 1;

    stage_id = get_ecco1_stage_id(session.stage_index, version, 1);
    current_stage_id = session.stage_id;

    if (current_stage_id == stage_id)
        return 0;

    invalid_ecco1_password(instance, ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL);
    return -1;
}

function validate_ecco1cd_thevents(instance)
{
    let session = instance.ecco1_session;
    let version = session.mode;

    let stage_id = 0;
    let current_stage_id = 0;

    stage_id = ECCO1CD_THEVENTS & ECCO1_MASK_STAGEID;
    current_stage_id = session.stage_id & ECCO1_MASK_STAGEID;

    if (current_stage_id != stage_id)
        return 1;

    stage_id = get_ecco1_stage_id(session.stage_index, version, 1);
    stage_id&= ~ECCO1_CHARGE_SONAR;

    current_stage_id = session.stage_id;
    current_stage_id&= ~ECCO1_CHARGE_SONAR;

    if (current_stage_id == stage_id)
        return 0;

    invalid_ecco1_password(instance, ECCO1_PERMA_KILL);
    return -1;
}

function validate_ecco1cd_deepwater2(instance)
{
    let session = instance.ecco1_session;
    let version = session.mode;

    let stage_id = 0;
    let current_stage_id = 0;

    stage_id = ECCO1CD_DEEPWATER2 & (ECCO1_MASK_STAGEID | ECCO1_TMACHINE_HOMEBAY);
    current_stage_id = session.stage_id & (ECCO1_MASK_STAGEID | ECCO1_TMACHINE_HOMEBAY);

    if (current_stage_id != stage_id)
        return 1;

    stage_id = get_ecco1_stage_id(session.stage_index, version, 1);
    stage_id&= ~(ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL);
    stage_id|= ECCO1_GLOBE_OBTAINED_DEFAULT_MASK;        

    current_stage_id = session.stage_id & ~(ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL);
    if (current_stage_id & ECCO1_GLOBE_OBTAINED_DEFAULT_MASK)
        current_stage_id|= ECCO1_GLOBE_OBTAINED_DEFAULT_MASK;

    if (current_stage_id == stage_id)
        return 0;

    invalid_ecco1_password(instance, 0);
    return -1;
}

function validate_ecco1cd_password(instance)
{
    let session = instance.ecco1_session;
    let version = session.mode;

    let current_stage_id = 0;
    let stage_id = 0;

    let result = 0;

    if (session.error_id < 0)
    {
        invalid_ecco1_password(instance, 0);
        return -1;
    }

    result = validate_ecco1cd_undercaves(instance);
    if (result == 0 || result == -1) return result;

    result = validate_ecco1cd_thevents(instance);
    if (result == 0 || result == -1) return result;

    result = validate_ecco1cd_deepwater2(instance);
    if (result == 0 || result == -1) return result;

    current_stage_id = session.stage_id & ~(ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL);

    stage_id = get_ecco1_stage_id(session.stage_index, version, 1);
    stage_id&= ~(ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL);

    if (current_stage_id == stage_id)
        return 0;

    invalid_ecco1_password(instance, 0);
    return -1;
}

// END ECCO THE DOLPHIN SEGA CD
// BEGIN ECCO THE DOLPHIN DEFAULT

function get_ecco1_stage_menu(id, version)
{
    let table = null;

    if (version == ECCO1JP_MEGADRIVE)
        table = get_ecco1jpmd_table_stage_menu();
    else if (version == ECCO1_SEGACD)
        table = get_ecco1cd_table_stage_menu();
    else
        table = get_ecco1md_table_stage_menu();

    if (id == -1) return table;
    return get_table_index(id, table);
}

function get_ecco1_stage_id(index, version, flags)
{
    let table = null;

    if (version == ECCO1JP_MEGADRIVE)
        table = get_ecco1jpmd_table_stage_id(flags);
    else if (version == ECCO1_SEGACD)
        table = get_ecco1cd_table_stage_id(flags);
    else
        table = get_ecco1md_table_stage_id(flags);

    if (index == -1) return table;
    return table[index];
}

function get_ecco1_stage_name(index, version)
{
    let table = null;

    if (version == ECCO1JP_MEGADRIVE)
        table = get_ecco1jpmd_table_stage_name();
    else if (version == ECCO1_SEGACD)
        table = get_ecco1cd_table_stage_name();
    else
        table = get_ecco1md_table_stage_name();

    if (index == -1)
        return "Invalid Password";

    else if (index >= table.length)
        return "Invalid Password";

    return table[index];
}

function get_ecco1_stage_description(index, version)
{   
    let table = null;

    if (version == ECCO1JP_MEGADRIVE)
        table = get_ecco1jpmd_table_stage_description();
    else if (version == ECCO1_SEGACD)
        table = get_ecco1cd_table_stage_description();
    else
        table = get_ecco1md_table_stage_description();

    if (index == -1)
        return "\n\n";

    else if (index >= table.length)
        return "\n\n";

    else if (table[index] == -1)
        return "\n\n";

    return table[index];
}

function get_ecco1_stage_caption(index, version)
{   
    let table = null;

    if (version == ECCO1JP_MEGADRIVE)
        table = get_ecco1jpmd_table_stage_caption();
    else if (version == ECCO1_SEGACD)
        table = get_ecco1cd_table_stage_caption();
    else
        table = get_ecco1md_table_stage_caption();

    if (index == -1)
        return "ecco1_caption_title_screen";

    else if (index >= table.length)
        return "ecco1_caption_title_screen";

    return table[index];
}

function get_ecco1_stage_theme(index, version)
{   
    let table = null;

    if (version == ECCO1JP_MEGADRIVE)
        table = get_ecco1jpmd_table_stage_theme();
    else if (version == ECCO1_SEGACD)
        table = get_ecco1cd_table_stage_theme();
    else
        table = get_ecco1md_table_stage_theme();

    if (index == -1)
        return THEME_DEFAULT;

    else if (index >= table.length)
        return THEME_DEFAULT;

    return table[index];
}

function validate_ecco1_password(instance)
{
    let session = instance.ecco1_session;
    let version = instance.version;

    if (version == ECCO1JP_MEGADRIVE)
    {
        if (validate_ecco1jpmd_password(instance) == -1)
            return -1;
    }
    else if (version == ECCO1_SEGACD)
    {
        if (validate_ecco1cd_password(instance) == -1)
            return -1;
    }
    else if (version == ECCO1_MEGADRIVE)
    {
        if (session.error_id < 0)
        {
            invalid_ecco1_password(instance);
            return -1;
        }

        else if ((session.stage_event == ECCO1_STORM_VORTEX) && (session.unlimited_air == 0))
        {         
            invalid_ecco1_password(instance);
            return -1;
        }
    }

    return 0;
}

// END ECCO THE DOLPHIN DEFAULT
// BEGIN ECCO THE DOLPHIN GOAT

function get_ecco1md_table_goat_menu()
{
    let table = [
        "menu_ecco1md_goat_01",
        "menu_ecco1md_goat_02",
        "menu_ecco1md_goat_03",
        "menu_ecco1md_goat_04",
        "menu_ecco1md_goat_05",

        "menu_ecco1md_goat_p01",
        "menu_ecco1md_goat_p02",
        "menu_ecco1md_goat_p03",
        "menu_ecco1md_goat_p04",
        "menu_ecco1md_goat_p05",
        "menu_ecco1md_goat_p06",
        "menu_ecco1md_goat_p07",
        "menu_ecco1md_goat_p08",
        "menu_ecco1md_goat_p09",
        "menu_ecco1md_goat_p10",
        "menu_ecco1md_goat_p11",
        "menu_ecco1md_goat_p12",
        "menu_ecco1md_goat_p13",
        "menu_ecco1md_goat_p14",

        "menu_ecco1md_goat_201",
        "menu_ecco1md_goat_202",
        "menu_ecco1md_goat_203",
        "menu_ecco1md_goat_204",
        "menu_ecco1md_goat_205",
        "menu_ecco1md_goat_206",
        "menu_ecco1md_goat_207",
        "menu_ecco1md_goat_208",
        "menu_ecco1md_goat_209",
        "menu_ecco1md_goat_210",
        "menu_ecco1md_goat_211",
        "menu_ecco1md_goat_212",
        "menu_ecco1md_goat_213",
        "menu_ecco1md_goat_214",
        "menu_ecco1md_goat_215",
        "menu_ecco1md_goat_216",
        "menu_ecco1md_goat_217",
        "menu_ecco1md_goat_218",

        "menu_ecco1md_goat_r01",
        "menu_ecco1md_goat_r02",
        "menu_ecco1md_goat_r99"
    ];

    return table;
}

function get_ecco1md_table_goat_password()
{
    let table = [
        -1,
        "ALNELSIN",
        "FIVEPODS",
        "LIFEFISH",
        "SHARKFIN",

        "PLEASEEE",
        "PLEASEFF",
        "PLEASEGG",
        "PLEASEHH",
        "PLEASEII",
        "PLEASEKK",
        "PLEASEOO",
        "PLEASEPP",
        "PLEASEQQ",
        "PLEASERR",
        "PLEASESS",
        "PLEASEUU",
        "PLEASEWW",
        "PLEASEZZ",
 
        "      AA",
        "      BB",
        "      CC",
        "      EE",
        "      FF",
        "      GG",
        "      II",
        "      KK",
        "      LL",
        "      MM",
        "      OO",
        "      PP",
        "      QQ",
        "      SS",
        "      UU",
        "      VV",
        "      YY",
        "      ZZ",

        "AAAAAAAA",
        "NNNNNNNN",
        "       A"
    ];

    return table;
}

function menu_ecco1md_goat_handler(instance, id, table)
{
    let session = instance.ecco1_session;
    let password = "";

    index = get_table_index(id, table);

    password = get_table2_value(index, get_ecco1md_table_goat_password());
    disable_all_panels();    

    if (password ==  -1)
    {
        set_block_visibility("panel_ecco1", 1);
        return;
    }

    menu2_item_highlight(id, table);
    decode_ecco1_password(instance, password)
}

// END ECCO THE DOLPHIN GOAT

function ecco1_get_password(session)
{
    let password_record = null;

    password_record = ecco1_generate_password(
	session.stage_id & ECCO1_MASK_STAGEID,
	session.stage_id & ECCO1_MASK_STAGEFLAGS,
	session.death_counter,
	session.time_elapsed,
        session.mode);

    session.unencrypted_data = password_record.unencrypted_data;
    session.error_id = password_record.result;

    return password_record.password;
}

function set_ecco1_stage_caption(id)
{
    let table = [
        "ecco1_caption_title_screen",
        "ecco1_caption_selection_scr",
        "ecco1_caption_home_bay",
        "ecco1_caption_undercaves",
        "ecco1_caption_ice_zone",
        "ecco1_caption_big_blue",
        "ecco1_caption_deep_water",
        "ecco1_caption_deep_gate",
        "ecco1_caption_atlantis",
        "ecco1_caption_the_library",
        "ecco1_caption_city_of_forever",
        "ecco1_caption_jurassic_beach",
        "ecco1_caption_dark_water",
        "ecco1_caption_the_tube",
        "ecco1_caption_the_machine",
        "ecco1_caption_the_stomach",
        "ecco1_caption_the_last_fight",
        "ecco1_caption_storm",
        "ecco1_caption_asterite_first_encounter",
        "ecco1_caption_time_machine_jurassic",
        "ecco1_caption_asterite_return_globe",
        "ecco1_caption_time_machine_home",
        "ecco1_caption_storm_tube",
        "ecco1_caption_time_machine_title",
        "ecco1_caption_time_machine_outoforder",
        "ecco1_caption_deepwater_noexit",
        "ecco1_caption_deepwater_trapped",
        "ecco1_caption_preasterite_fight"
    ];

    let index = 0;

    for (index = 0; index < table.length; index++)
    {
        if (id == table[index])
            set_inline_visibility(table[index], 1); 
        else
            set_inline_visibility(table[index], 0); 
    }
}

function update_ecco1_debug_mode(instance)
{
    let unencrypted_data = 0;
    let time_elapsed = 0;
    let stage_id = 0;
    let air_globe = 0;
    let stage_event = 0;
    let special_abilities = 0;
    let death_counter = 0;

    let session = instance.ecco1_session;

    set_block_visibility("panel_debug_mode", 0);
    if (session.debug_mode == 1)
        set_block_visibility("panel_debug_mode", 1);

    unencrypted_data = session.unencrypted_data;
    time_elapsed = unencrypted_data & 0xffff;
    stage_id = (unencrypted_data >>> 16) & 0x1f;
    air_globe = (unencrypted_data >>> 21) & 0xf;

    stage_event = unencrypted_data >>> 25;
    stage_event = stage_event << 1;
    stage_event&= 0x7;

    special_abilities = (unencrypted_data >>> 27) & 0x18;
    death_counter = (unencrypted_data >>> 27) & 0x7;

    unencrypted_data = unencrypted_data.toString(16).toUpperCase();
    time_elapsed = time_elapsed.toString(16).toUpperCase();
    stage_id = stage_id.toString(16).toUpperCase();
    air_globe = air_globe.toString(16).toUpperCase();
    stage_event = stage_event.toString(16).toUpperCase();
    special_abilities = special_abilities.toString(16).toUpperCase();
    death_counter = death_counter.toString(16).toUpperCase();

    document.getElementById("ecco1_label_unencrypted_data").innerHTML = unencrypted_data;
    document.getElementById("ecco1_label_debug_time_elapsed").innerHTML = time_elapsed;
    document.getElementById("ecco1_label_debug_stage_id").innerHTML = stage_id;
    document.getElementById("ecco1_label_debug_air_globe").innerHTML = air_globe;
    document.getElementById("ecco1_label_debug_stage_event").innerHTML = stage_event;
    document.getElementById("ecco1_label_debug_special_abilities").innerHTML = special_abilities;
    document.getElementById("ecco1_label_debug_death_counter").innerHTML = death_counter;
}

function update_ecco1md_stage_attributes(instance)
{
    let stage_id = 0;

    if (instance.version != ECCO1_MEGADRIVE) return;
    stage_id = instance.ecco1_session.stage_id;

    set_block_visibility("dialog_stage_event", 0);
    set_block_visibility("menu_item_unlimited_air", 0);

    set_block_visibility("dialog_globe_obtained", 0);
    set_block_visibility("menu_item_ecco1_globe_02", 0);
    set_block_visibility("menu_item_ecco1_globe_07", 0);
    set_block_visibility("menu_item_ecco1_globe_08", 0);
    set_block_visibility("menu_item_ecco1_globe_09", 0);

    set_block_visibility("block_ecco1_special_abilities", 1);
    set_block_visibility("block_ecco1_charge", 1);
    set_block_visibility("block_ecco1_kill", 1);

    switch (stage_id & ECCO1_MASK_STAGEID)
    {
        case (ECCO1_SELECTIONSCR & ECCO1_MASK_STAGEID):
        {
            set_block_visibility("dialog_stage_event", 1);
            set_block_visibility("menu_item_unlimited_air", 1);

            set_block_visibility("dialog_globe_obtained", 1);
            set_block_visibility("menu_item_ecco1_globe_02", 1);
            set_block_visibility("menu_item_ecco1_globe_07", 1);
            set_block_visibility("menu_item_ecco1_globe_08", 1);
            set_block_visibility("menu_item_ecco1_globe_09", 1);

            set_block_visibility("block_ecco1_special_abilities", 1);
            set_block_visibility("block_ecco1_charge", 1);
            set_block_visibility("block_ecco1_kill", 1);
 
            break;
        }

        case (ECCO1_DEEPWATER1 & ECCO1_MASK_STAGEID):
        {
            if (stage_id & ECCO1_GLOBE_OBTAINED_DEFAULT_MASK)
                set_block_visibility("dialog_globe_obtained", 1);
 
            break;
        }
    }
}

function update_ecco1jpmd_stage_attributes(instance)
{
    let stage_id = 0;

    if (instance.version != ECCO1JP_MEGADRIVE) return;
    stage_id = instance.ecco1_session.stage_id;

    set_block_visibility("dialog_stage_event", 0);
    set_block_visibility("menu_item_unlimited_air", 0);

    set_block_visibility("dialog_globe_obtained", 0);
    set_block_visibility("menu_item_ecco1_globe_02", 0);
    set_block_visibility("menu_item_ecco1_globe_07", 0);
    set_block_visibility("menu_item_ecco1_globe_08", 0);
    set_block_visibility("menu_item_ecco1_globe_09", 0);

    set_block_visibility("block_ecco1_special_abilities", 1);
    set_block_visibility("block_ecco1_charge", 1);
    set_block_visibility("block_ecco1_kill", 1);

    switch (stage_id & ECCO1_MASK_STAGEID)
    {
        case (ECCO1JPMD_SELECTIONSCR & ECCO1_MASK_STAGEID):
        {
            set_block_visibility("dialog_stage_event", 1);
            set_block_visibility("menu_item_unlimited_air", 1);

            set_block_visibility("dialog_globe_obtained", 1);
            set_block_visibility("menu_item_ecco1_globe_02", 1);
            set_block_visibility("menu_item_ecco1_globe_07", 1);
            set_block_visibility("menu_item_ecco1_globe_08", 1);
            set_block_visibility("menu_item_ecco1_globe_09", 1);

            set_block_visibility("block_ecco1_special_abilities", 1);
            set_block_visibility("block_ecco1_charge", 1);
            set_block_visibility("block_ecco1_kill", 1);
 
            break;
        }

        case (ECCO1JPMD_DEEPWATER1 & ECCO1_MASK_STAGEID):
        {
            if (stage_id & ECCO1_GLOBE_OBTAINED_DEFAULT_MASK)
                set_block_visibility("dialog_globe_obtained", 1);
 
            break;
        }
    }
}

function update_ecco1cd_stage_attributes(instance)
{
    let stage_id = 0;

    if (instance.version != ECCO1_SEGACD) return;
    stage_id = instance.ecco1_session.stage_id;

    set_block_visibility("dialog_stage_event", 0);
    set_block_visibility("menu_item_unlimited_air", 0);

    set_block_visibility("dialog_globe_obtained", 0);
    set_block_visibility("menu_item_ecco1_globe_02", 0);
    set_block_visibility("menu_item_ecco1_globe_07", 0);
    set_block_visibility("menu_item_ecco1_globe_08", 0);
    set_block_visibility("menu_item_ecco1_globe_09", 0);

    set_block_visibility("block_ecco1_special_abilities", 1);
    set_block_visibility("block_ecco1_charge", 1);
    set_block_visibility("block_ecco1_kill", 1);

    switch (stage_id & ECCO1_MASK_STAGEID)
    {
        case (ECCO1CD_UNDERCAVES & ECCO1_MASK_STAGEID):
        {
            set_block_visibility("dialog_globe_obtained", 0);
            set_block_visibility("block_ecco1_special_abilities", 0);

            break;;
        }

        case (ECCO1CD_THEVENTS & ECCO1_MASK_STAGEID):
        {
            set_block_visibility("dialog_globe_obtained", 0);
            set_block_visibility("block_ecco1_special_abilities", 1);
            set_block_visibility("block_ecco1_charge", 1);
            set_block_visibility("block_ecco1_kill", 0);
 
            break;;
        }

        case (ECCO1CD_DEEPWATER1 & ECCO1_MASK_STAGEID):
        {
            if (stage_id & ECCO1_GLOBE_OBTAINED_DEFAULT_MASK)
                set_block_visibility("dialog_globe_obtained", 1);
 
            break;
        }
    }
}

function update_ecco1_stage_attributes(instance)
{
    let session = instance.ecco1_session;
    let stage_id = 0;

    if (session.developer_mode == 1)
    {
        set_block_visibility("dialog_stage_event", 1);
        set_block_visibility("dialog_globe_obtained", 1);
        set_block_visibility("menu_item_ecco1_globe_02", 1);
        set_block_visibility("menu_item_ecco1_globe_07", 1);
        set_block_visibility("menu_item_ecco1_globe_08", 1);
        set_block_visibility("menu_item_ecco1_globe_09", 1);

        set_block_visibility("block_ecco1_special_abilities", 1);
        set_block_visibility("menu_item_unlimited_air", 1);
        set_block_visibility("block_ecco1_charge", 1);
        set_block_visibility("block_ecco1_kill", 1);
 
        return; 
    }

    if (instance.version == ECCO1_SEGACD)
        update_ecco1cd_stage_attributes(instance);
    else if (instance.version == ECCO1JP_MEGADRIVE)
        update_ecco1jpmd_stage_attributes(instance);
    else
        update_ecco1md_stage_attributes(instance);
}

function update_ecco1_developer_mode(instance)
{
    update_ecco1_stage_attributes(instance);
}

function update_ecco1_menu_all(instance)
{
    let table = null;
    let session = instance.ecco1_session;
    let version = session.mode;

    table = get_menu_ecco1_scenario_resource();
    dialog_panel_highlight(session.scenario_key, table);

    table = get_ecco1_stage_menu(-1, version)
    session.stage_key = table[session.stage_index];
    menu2_item_highlight(session.stage_key, table);

    table = get_menu_ecco1_stage_event_resource();
    session.stage_event_key = get_table_key(session.stage_event, table);
    menu_item_highlight(session.stage_event_key, table);

    table = get_menu_ecco1_globe_obtained_resource();
    session.globe_obtained_key = get_table_key(session.globe_obtained, table);
    menu_item_highlight(session.globe_obtained_key, table);

    table = get_menu_ecco1_death_counter_resource();
    session.death_counter_key = get_table_key(session.death_counter, table);
    menu_item_highlight(session.death_counter_key, table);

    session.scenario_name = ecco1_get_scenario_name(session.scenario_key);
    session.stage_name = get_ecco1_stage_name(session.stage_index, version);

    session.stage_event_name = ecco1_get_stage_event_name(session.stage_event_key);
    session.globe_obtained_name = ecco1_get_globe_obtained_name(session.globe_obtained_key);
    session.death_counter_name = ecco1_get_death_counter_name(session.death_counter_key);

    document.getElementById("ecco1_label_scenario").innerHTML = session.scenario_name;
    document.getElementById("ecco1_label_stage").innerHTML = session.stage_name;
    document.getElementById("ecco1_label_stage_event").innerHTML = session.stage_event_name;
    document.getElementById("ecco1_label_globe_obtained").innerHTML = session.globe_obtained_name;
    document.getElementById("ecco1_label_death_counter").innerHTML = session.death_counter_name;
}

function update_ecco1_form(instance)
{
    let index = 0;
    let table = null;
    let session = instance.ecco1_session;

    disable_all_panels();

    update_ecco1_debug_mode(instance);
    update_ecco1_menu_all(instance);

    document.getElementById("ecco1_label_password_suggestion").innerHTML = session.password_suggestion;
    document.getElementById("ecco1_textin_decoded_password").value = session.password;

    switch_toggle("ecco1_switch_air", session.unlimited_air);
    switch_toggle("ecco1_switch_charge", session.charge_sonar);
    switch_toggle("ecco1_switch_kill", session.perma_kill);
    switch_toggle("ecco1_switch_50_frames", session.frames_per_second);

    enable_spheres(session.stage_id);
    ecco1_enable_globe_icon(session.globe_obtained);

    session.stage_description = get_ecco1_stage_description(session.stage_index, session.mode);
    session.stage_theme = get_ecco1_stage_theme(session.stage_index, session.mode);

    validate_ecco1_password(instance);
    set_ecco1_stage_caption(session.stage_caption)

    raw_string = session.stage_name + "\n"
    raw_string+= session.stage_description;
    raw_string+= session.password;
 
    text_generator_set_output(instance.text_generator, raw_string);
    instance.text_generator.config.THEME = session.stage_theme; 

    set_block_visibility("panel_ecco1", 1);
}

// BEGIN: menu_ecco1_scenario

function get_ecco1_scenario_caption(id)
{
    let table = [
        "menu_ecco1_scenario_03", "ecco1_caption_storm",
        "menu_ecco1_scenario_04", "ecco1_caption_asterite_first_encounter",
        "menu_ecco1_scenario_05", "ecco1_caption_time_machine_jurassic",
        "menu_ecco1_scenario_06", "ecco1_caption_asterite_return_globe",
        "menu_ecco1_scenario_07", "ecco1_caption_time_machine_home",
        "menu_ecco1_scenario_08", "ecco1_caption_storm_tube",
        "menu_ecco1_scenario_09", "ecco1_caption_time_machine_title",
        "menu_ecco1_scenario_10", "ecco1_caption_time_machine_outoforder",
        "menu_ecco1_scenario_11", "ecco1_caption_deepwater_noexit",
        "menu_ecco1_scenario_12", "ecco1_caption_deepwater_trapped",
        "menu_ecco1_scenario_13", "ecco1_caption_preasterite_fight"
    ];

    let result = get_table_value(id, table);
    if (result == null) result = "ecco1_caption_title_screen";

    return result;
}

function ecco1_get_scenario_name(id)
{
    let table = [
        "menu_ecco1_scenario_03", "Home Bay just before The Storm",
        "menu_ecco1_scenario_04", "Ecco encounters the Asterite for the first time",
        "menu_ecco1_scenario_05", "Time Machine sends Ecco to Jurassic Beach",
        "menu_ecco1_scenario_06", "Ecco returns the Asterite's missing globe",
        "menu_ecco1_scenario_07", "Time Machine sends Ecco to Home Bay just before The Storm",
        "menu_ecco1_scenario_08", "The Storm sends Ecco to The Tube",
        "menu_ecco1_scenario_09", "Time Machine sends Ecco to the Title Screen",
        "menu_ecco1_scenario_10", "Time Machine Out of Order",
        "menu_ecco1_scenario_11", "Deep Water Stage has no exit",
        "menu_ecco1_scenario_12", "Ecco gets trapped in the Asterite's Cave",
        "menu_ecco1_scenario_13", "Prehistoric Asterite respawns after it is defeated"
    ];

    let result = get_table_value(id, table);
    if (result == null) result = "User Defined";

    return result;
}

function get_menu_ecco1_scenario_resource()
{
    let table = [
        "menu_ecco1_scenario_01", -1,
        "menu_ecco1_scenario_02", -2,
        "menu_ecco1_scenario_03", ECCO1_SCENARIO_STORM_DROPBACK,
        "menu_ecco1_scenario_04", ECCO1_SCENARIO_DEEPWATER_FINDGLOBE,
        "menu_ecco1_scenario_05", ECCO1_SCENARIO_CITYOFFOREVER_TOJURASSIC,
        "menu_ecco1_scenario_06", ECCO1_SCENARIO_DEEPWATER_RETURNGLOBE,
        "menu_ecco1_scenario_07", ECCO1_SCENARIO_CITYOFFOREVER_TOHOMEBAY,
        "menu_ecco1_scenario_08", ECCO1_SCENARIO_STORM_VORTEX,
        "menu_ecco1_scenario_09", ECCO1_SCENARIO_TMACHINE_TITLESCREEN,
        "menu_ecco1_scenario_10", ECCO1_SCENARIO_TMACHINE_DOESNTWORK,
        "menu_ecco1_scenario_11", ECCO1_SCENARIO_ASTERITECOMPLETE_NOEXITSTAGE,
        "menu_ecco1_scenario_12", ECCO1_SCENARIO_ASTERITECOMPLETE_TRAPPEDINCAVE,
        "menu_ecco1_scenario_13", ECCO1_SCENARIO_PREASTERITE_COMMUNICATES
    ];

    return table;
}

function menu_ecco1_scenario_handler(instance, id, table)
{
    let session = instance.ecco1_session;    
    let scenario_id = 0;

    scenario_id = get_table_value(id, table);

    if (scenario_id == -1)
    {
        disable_all_panels();
        set_block_visibility("panel_ecco1", 1);
        return;
    }
    else if (scenario_id == -2)
    {
        session.scenario_key = "";
        session.stage_caption = get_ecco1_stage_caption(session.stage_id)

        update_ecco1_form(instance);
        return;
    }

    session.scenario_id = scenario_id;
    session.scenario_key = id;
    session.scenario_name = ecco1_get_scenario_name(id);

    session.stage_id = scenario_id;
    session.stage_event = scenario_id & ECCO1_STAGE_EVENT_MASK;
    session.globe_obtained = scenario_id & ECCO1_GLOBE_OBTAINED_MASK;
    session.unlimited_air = scenario_id & ECCO1_UNLIMITED_AIR;
    session.charge_sonar = scenario_id & ECCO1_CHARGE_SONAR;
    session.perma_kill = scenario_id & ECCO1_PERMA_KILL;
    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;

    let result = get_ecco1_stage_id(-1, session.mode, 0);
    session.stage_index = get_table_index(session.stage_id & ECCO1_MASK_STAGEID, result);

    session.stage_caption = get_ecco1_scenario_caption(id)
    update_ecco1_form(instance);
}

// END: menu_ecco1_scenario
// BEGIN ECCO THE DOLPHIN STAGE MENU

function menu_ecco1_stage_handler(instance, id, table)
{
    let session = instance.ecco1_session;
    let version = session.mode;

    let index = 0;
    let stage_id = 0;

    if (id == null)
    {
        if (version == ECCO1JP_MEGADRIVE)
            id = "menu_ecco1jpmd_stage_03";
        else if (version == ECCO1_SEGACD)
            id = "menu_ecco1cd_stage_02";
        else
            id = "menu_ecco1md_stage_03";
    }
    
    index = get_table_index(id, table);
    stage_id = get_ecco1_stage_id(index, version, 1);

    if (stage_id == -1)
    {
        disable_all_panels();
        set_block_visibility("panel_ecco1", 1);
        return;
    }

    session.scenario_key = "";

    session.stage_index = index;
    session.stage_id = stage_id;
    session.stage_key = id;

    session.stage_event = session.stage_id & ECCO1_STAGE_EVENT_MASK;
    session.globe_obtained = session.stage_id & ECCO1_GLOBE_OBTAINED_MASK;
    session.unlimited_air = session.stage_id & ECCO1_UNLIMITED_AIR;
    session.charge_sonar = session.stage_id & ECCO1_CHARGE_SONAR;
    session.perma_kill = session.stage_id & ECCO1_PERMA_KILL;

    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;

    session.stage_caption = get_ecco1_stage_caption(session.stage_index, version);

    update_ecco1_stage_attributes(instance);
    update_ecco1_form(instance);
}

// END ECCO THE DOLPHIN STAGE MENU
// BEGIN: menu_ecco1_stage_event

function ecco1_get_stage_event_name(key)
{
    let table = [
        "menu_ecco1_stage_event_02", "Time Machine sends Ecco to Jurassic Beach",
        "menu_ecco1_stage_event_03", "Time Machine sends Ecco to Home Bay",
        "menu_ecco1_stage_event_04", "The Storm sends Ecco to The Tube",
        "menu_ecco1_stage_event_05", "Stage Event 6 (Unused)"
    ];

    let result = get_table_value(key, table);
    if (result == null) result = "Custom Stage Event";

    return result;
}

function get_menu_ecco1_stage_event_resource()
{
    let table = [
        "menu_ecco1_stage_event_01", -1,
        "menu_ecco1_stage_event_02", ECCO1_TMACHINE_JURASSIC,
        "menu_ecco1_stage_event_03", ECCO1_TMACHINE_HOMEBAY,
        "menu_ecco1_stage_event_04", ECCO1_STORM_VORTEX,
        "menu_ecco1_stage_event_05", ECCO1_STAGE_EVENT_6
    ];

    return table;
}

function menu_ecco1_stage_event_handler(instance, id, table)
{
    let index = 0;
    let stage_event = 0;
    let session = null;    

    stage_event = get_table_value(id, table);

    if (stage_event == -1)
    {
        disable_all_panels();
        set_block_visibility("panel_ecco1", 1);
        return;
    }

    session = instance.ecco1_session;    

    session.scenario_key = "";
    session.stage_id = (session.stage_id & ~ECCO1_STAGE_EVENT_MASK) | stage_event;
    session.stage_event = stage_event;
    session.stage_event_name = ecco1_get_stage_event_name(id);

    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;

    session.stage_caption = get_ecco1_stage_caption(session.stage_index, session.mode);
    update_ecco1_form(instance);
}

// END: menu_ecco1_stage_event
// BEGIN: menu_ecco1_globe_obtained

function ecco1_get_globe_obtained_name(id)
{
    let table = [
        "menu_ecco1_globe_02", "No Globe Obtained",
        "menu_ecco1_globe_03", "&nbsp; Red Globe",
        "menu_ecco1_globe_04", "&nbsp; Brown Globe",
        "menu_ecco1_globe_05", "&nbsp; Purple Globe",
        "menu_ecco1_globe_06", "&nbsp; Green Globe",
        "menu_ecco1_globe_07", "&nbsp; Purple Globe 5 (Unused)",
        "menu_ecco1_globe_08", "&nbsp; Purple Globe 6 (Unused)",
        "menu_ecco1_globe_09", "&nbsp; Purple Globe 7 (Unused)",
    ];

    let result = get_table_value(id, table);
    if (result == null) result = "No Globe Obtained";

    return result;
}

function get_menu_ecco1_globe_obtained_resource()
{
    let table = [
        "menu_ecco1_globe_01", -1,
        "menu_ecco1_globe_02", 0,
        "menu_ecco1_globe_03", ECCO1_GLOBE_OBTAINED_RED,
        "menu_ecco1_globe_04", ECCO1_GLOBE_OBTAINED_BROWN,
        "menu_ecco1_globe_05", ECCO1_GLOBE_OBTAINED_PURPLE,
        "menu_ecco1_globe_06", ECCO1_GLOBE_OBTAINED_GREEN,
        "menu_ecco1_globe_07", ECCO1_GLOBE_OBTAINED_PURPLE5,
        "menu_ecco1_globe_08", ECCO1_GLOBE_OBTAINED_PURPLE6,
        "menu_ecco1_globe_09", ECCO1_GLOBE_OBTAINED_PURPLE7
    ];

    return table;
}

function menu_ecco1_globe_obtained_handler(instance, id, table)
{
    let index = 0;
    let globe_obtained = 0;
    let session = instance.ecco1_session;    

    globe_obtained = get_table_value(id, table);

    if (globe_obtained == -1)
    {
        disable_all_panels();
        set_block_visibility("panel_ecco1", 1);
        return;
    }

    session = instance.ecco1_session;    

    session.scenario_key = "";
    session.stage_id = (session.stage_id & ~ECCO1_GLOBE_OBTAINED_MASK) | globe_obtained;
    session.globe_obtained = globe_obtained;

    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;

    session.stage_caption = get_ecco1_stage_caption(session.stage_index, session.mode);
    update_ecco1_form(instance);
}

// END: menu_ecco1_globe_obtained
// BEGIN: menu_ecco1_death_counter

function ecco1_get_death_counter_name(key)
{
    let table = [
        "menu_ecco1_death_counter_02", "No deaths play through!",
        "menu_ecco1_death_counter_03", "Died once!",
        "menu_ecco1_death_counter_04", "Died twice!",
        "menu_ecco1_death_counter_05", "Died three times",
        "menu_ecco1_death_counter_06", "Died four times!",
        "menu_ecco1_death_counter_07", "Died five times!",
        "menu_ecco1_death_counter_08", "Died six times!",
        "menu_ecco1_death_counter_09", "Died seven or more times!"
    ];

    let result = get_table_value(key, table);
    if (result == null) result = "Unknown";

    return result;
}

function get_menu_ecco1_death_counter_resource()
{
    let table = [
        "menu_ecco1_death_counter_01", -1,
        "menu_ecco1_death_counter_02", 7,
        "menu_ecco1_death_counter_03", 6,
        "menu_ecco1_death_counter_04", 5,
        "menu_ecco1_death_counter_05", 4,
        "menu_ecco1_death_counter_06", 3,
        "menu_ecco1_death_counter_07", 2,
        "menu_ecco1_death_counter_08", 1,
        "menu_ecco1_death_counter_09", 0
    ];

    return table;
}

function menu_ecco1_death_counter_handler(instance, id, table)
{
    let index = 0;
    let death_counter = 0;
    let session = null;    

    death_counter = get_table_value(id, table);

    if (death_counter == -1)
    {
        disable_all_panels();
        set_block_visibility("panel_ecco1", 1);
        return;
    }

    session = instance.ecco1_session;    

    session.death_counter = death_counter;
    session.death_counter_name = ecco1_get_death_counter_name(id);

    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;
    session.stage_caption = get_ecco1_stage_caption(session.stage_index, session.mode);

    update_ecco1_form(instance);
}

function ecco_textin_time_elapsed_hms_handler(instance)
{
    let frames_per_second = 0;
    let session = instance.ecco1_session;

    frames_per_second = session.frames_per_second;
    if (session.frames_per_second == 0)
        frames_per_second = GENESIS_NTSC_FPS;

    session.time_elapsed_hours = document.getElementById("ecco_textin_time_elapsed_hours").value;
    session.time_elapsed_minutes = document.getElementById("ecco_textin_time_elapsed_minutes").value;
    session.time_elapsed_seconds = document.getElementById("ecco_textin_time_elapsed_seconds").value;

    if (session.time_elapsed_hours == "") return;
    if (session.time_elapsed_minutes == "") return;
    if (session.time_elapsed_seconds == "") return;

    if (isNaN(session.time_elapsed_hours)) return;
    if (isNaN(session.time_elapsed_minutes)) return;
    if (isNaN(session.time_elapsed_seconds)) return;

    session.time_elapsed_hours = parseInt(session.time_elapsed_hours);
    session.time_elapsed_minutes = parseInt(session.time_elapsed_minutes);
    session.time_elapsed_seconds = parseInt(session.time_elapsed_seconds);

    session.time_elapsed_total_seconds = (session.time_elapsed_hours * 60 * 60) + 
        (session.time_elapsed_minutes * 60) + session.time_elapsed_seconds;

    session.time_elapsed = session.time_elapsed_total_seconds * frames_per_second;

    document.getElementById("ecco_textin_time_elapsed_total_seconds").value = Math.trunc(session.time_elapsed_total_seconds);
    document.getElementById("ecco_textin_time_elapsed").value = Math.trunc(session.time_elapsed);

    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;
 
    session.stage_caption = get_ecco1_stage_caption(session.stage_index, session.mode);
    update_ecco1_form(instance);
}

function ecco1_switch_50_frames(instance, value)
{
    let frames_per_second = 0;
    let session = null;

    session = instance.ecco1_session;

    session.frames_per_second = 0;
    if (value == 1)
        session.frames_per_second = MEGADRIVE_PAL_FPS;

    frames_per_second = session.frames_per_second;
    if (session.frames_per_second == 0)
        frames_per_second = GENESIS_NTSC_FPS;

    session.time_elapsed_total_seconds = session.time_elapsed/frames_per_second;
    session.time_elapsed_total_seconds = Math.trunc(session.time_elapsed_total_seconds); 

    document.getElementById("ecco_textin_time_elapsed_total_seconds").value = session.time_elapsed_total_seconds;
    document.getElementById("ecco_textin_time_elapsed").value = session.time_elapsed;

    update_ecco_time_elapsed(instance);

    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;
 
    session.stage_caption = get_ecco1_stage_caption(session.stage_index, session.mode);
    update_ecco1_form(instance);
};

function ecco1_switch_air(instance, value)
{
    let session = instance.ecco1_session;

    if (value == 1)
        session.unlimited_air = ECCO1_UNLIMITED_AIR;
    else
        session.unlimited_air = 0;

    session.scenario_key = "";
    session.stage_id = (session.stage_id & ~ECCO1_UNLIMITED_AIR) | session.unlimited_air;
    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;

    session.stage_caption = get_ecco1_stage_caption(session.stage_index, session.mode);
    update_ecco1_form(instance);
};

function ecco1_switch_charge(instance, value)
{
    let session = instance.ecco1_session;

    if (value == 1)
        session.charge_sonar = ECCO1_CHARGE_SONAR;
    else
        session.charge_sonar = 0;

    session.scenario_key = "";
    session.stage_id = (session.stage_id & ~ECCO1_CHARGE_SONAR) | session.charge_sonar;
    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;

    session.stage_caption = get_ecco1_stage_caption(session.stage_index, session.mode);
    update_ecco1_form(instance);
};

function ecco1_switch_kill(instance, value)
{
    let session = instance.ecco1_session;

    if (value == 1)
        session.perma_kill = ECCO1_PERMA_KILL;
    else
        session.perma_kill = 0;

    session.scenario_key = "";
    session.stage_id = (session.stage_id & ~ECCO1_PERMA_KILL) | session.perma_kill;
    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;

    session.stage_caption = get_ecco1_stage_caption(session.stage_index, session.mode);
    update_ecco1_form(instance);
};

function ecco_switch_debug_mode(instance, value)
{
    let session = instance.ecco1_session;

    session.debug_mode = 0;
    if (value == 1)
        session.debug_mode = 1;

    set_block_visibility("panel_debug_mode", session.debug_mode);
    update_ecco1_debug_mode(instance);
    switch_toggle("ecco_switch_debug_mode", session.debug_mode);
};

function ecco_switch_developer_mode(instance, value)
{
    let session = instance.ecco1_session;
    let developer_mode = 0;

    session.developer_mode = 0;
    if (value == 1)
        session.developer_mode = 1;

    update_ecco1_developer_mode(instance);
    switch_toggle("ecco_switch_developer_mode", session.developer_mode);
};

function ecco_switch_cheat_mode(instance, value)
{
    let session = instance.ecco1_session;
    let frames_per_second = 0;
 
    session.cheat_mode = 0;
    if (value == 1)
    {
        session.cheat_mode = 1;

        session.time_elapsed = 0;
        set_block_visibility("ecco1_block_time_elapsed", 0);
    }
    else 
    {
        session.cheat_mode = 0;

        session.time_elapsed = 64;
        set_block_visibility("ecco1_block_time_elapsed", 1);
    }

    frames_per_second = session.frames_per_second;
    if (session.frames_per_second == 0)
        frames_per_second = GENESIS_NTSC_FPS;

    session.time_elapsed_total_seconds = session.time_elapsed/frames_per_second;
    session.time_elapsed_total_seconds = Math.trunc(session.time_elapsed_total_seconds); 

    document.getElementById("ecco_textin_time_elapsed_total_seconds").value = session.time_elapsed_total_seconds;
    document.getElementById("ecco_textin_time_elapsed").value = session.time_elapsed;

    update_ecco_time_elapsed(instance);

    session.password = ecco1_get_password(session)
    session.password_suggestion = session.password;
 
    switch_toggle("ecco1_switch_cheat_mode", session.cheat_mode);
    update_ecco1_form(instance);
};

// DO NOT DELETE! IMPORTANT!
function decode_ecco1_password(instance, raw_password)
{
    let index = 0;

    let password = "";
    let password_suggestion = ""

    let password_record = null;
 
    let session = instance.ecco1_session;
    let frames_per_second = 0;

    raw_password = raw_password.toUpperCase();
    password = raw_password;

    // need to include no stage event

    if (password.length < 8)
        for (index = password.length; index < 8; index++)
            password+= " ";

    if (session.mode == ECCO1JP_MEGADRIVE)
    	password_record = ecco1jpmd_decrypt_password(password);
    else if (session.mode == ECCO1_SEGACD)
    	password_record = ecco1cd_decrypt_password(password);
    else
    	password_record = ecco1md_decrypt_password(password);

    password_suggestion = password.replace(/ /g, "-");
    password_suggestion = replace_char_at(password_suggestion, 7, password_record.checksum);

    session.stage_id = 0;
    session.password = raw_password;
    session.password_suggestion = password_suggestion;

    session.error_id = password_record.result;   

    if (password_record.result != 0) 
    {
        update_ecco1_form(instance);
        return;
    }

    session.unencrypted_data = password_record.unencrypted_data;
    session.stage_id = password_record.stage_id | password_record.flags;
    session.death_counter = password_record.death_counter;

    session.time_elapsed = password_record.time_elapsed << 6;

    table = get_ecco1_stage_id(-1, session.mode, 0);
    session.stage_index = get_table_index(session.stage_id & ECCO1_MASK_STAGEID, table);

    if (session.mode != ECCO1_SEGACD)
        if (session.stage_index == -1)
            session.stage_index = 1;
 
    frames_per_second = session.frames_per_second;
    if (session.frames_per_second == 0)
        frames_per_second = GENESIS_NTSC_FPS;

    session.time_elapsed_total_seconds = session.time_elapsed/frames_per_second;
    session.time_elapsed_total_seconds = Math.trunc(session.time_elapsed_total_seconds); 

    document.getElementById("ecco_textin_time_elapsed_total_seconds").value = session.time_elapsed_total_seconds;
    document.getElementById("ecco_textin_time_elapsed").value = session.time_elapsed;
 
    session.stage_event = password_record.flags & ECCO1_STAGE_EVENT_MASK;
    session.globe_obtained = (session.stage_id & ECCO1_GLOBE_OBTAINED_MASK);
    session.unlimited_air = (session.stage_id & ECCO1_UNLIMITED_AIR);
    session.charge_sonar = (session.stage_id & ECCO1_CHARGE_SONAR);
    session.perma_kill = (session.stage_id & ECCO1_PERMA_KILL);

    session.stage_caption = get_ecco1_stage_caption(session.stage_index, session.mode);

    update_ecco1_stage_attributes(instance);
    update_ecco_time_elapsed(instance);
    update_ecco1_form(instance);
}

function get_ecco1_globe_icon_resource()
{
    let table = [
        ECCO1_GLOBE_OBTAINED_RED, "ecco1_globe_red",
        ECCO1_GLOBE_OBTAINED_BROWN, "ecco1_globe_brown",
        ECCO1_GLOBE_OBTAINED_PURPLE, "ecco1_globe_purple",
        ECCO1_GLOBE_OBTAINED_GREEN, "ecco1_globe_green", 
        ECCO1_GLOBE_OBTAINED_PURPLE5, "ecco1_globe_purple", 
        ECCO1_GLOBE_OBTAINED_PURPLE6, "ecco1_globe_purple",
        ECCO1_GLOBE_OBTAINED_PURPLE7, "ecco1_globe_purple"
    ];

    return table;
}

function ecco1_disable_globe_icons()
{

    let table = get_ecco1_globe_icon_resource();
    let index = 0;

    for (index = 0; index < table.length/2; index++)
        set_inline_visibility(table[(index * 2) + 1], 0); 
}

function ecco1_enable_globe_icon(globe_obtained)
{
    ecco1_disable_globe_icons();

    if (globe_obtained == 0)
        return;

    let id = get_table_value(
        globe_obtained, 
        get_ecco1_globe_icon_resource());

    ecco1_disable_globe_icons();
    set_inline_visibility(id, 1); 
}

function disable_spheres()
{
    let table = [
        "globe_air_disabled",
        "globe_glo_disabled",
        "globe_cha_disabled",
        "globe_kil_disabled",

        "globe_jur_enabled",
        "globe_hom_enabled",
        "globe_vor_enabled",
        "globe_air_enabled",
        "globe_cha_enabled",
        "globe_kil_enabled",

        "globe_glo_red",
        "globe_glo_brown",
        "globe_glo_purple",
        "globe_glo_green",
        "globe_glo_purple5",
        "globe_glo_purple6",
        "globe_glo_purple7"
    ];

    let index = 0;

    for (index = 0; index < table.length; index++)
        set_inline_visibility(table[index], 0); 

    for (index = 0; index < 4; index++)
        set_inline_visibility(table[index], 1); 
}

function enable_spheres(flags)
{
    let stage_event = flags & ECCO1_STAGE_EVENT_MASK;
    let globe_obtained = flags & ECCO1_GLOBE_OBTAINED_MASK;
    let unlimited_air = flags & ECCO1_UNLIMITED_AIR;
    let charge_sonar = flags & ECCO1_CHARGE_SONAR;
    let perma_kill = flags & ECCO1_PERMA_KILL;

    disable_spheres();

    if (stage_event & ECCO1_TMACHINE_JURASSIC) 
        set_inline_visibility("globe_jur_enabled", 1);

    if (stage_event & ECCO1_TMACHINE_HOMEBAY)
        set_inline_visibility("globe_hom_enabled", 1);
 
    if (stage_event & ECCO1_STORM_VORTEX)
        set_inline_visibility("globe_vor_enabled", 1);

    switch(globe_obtained)
    {
        case ECCO1_GLOBE_OBTAINED_RED: 
        {
            set_inline_visibility("globe_glo_red", 1);
            set_inline_visibility("globe_glo_disabled", 0);

            break;
        }

        case ECCO1_GLOBE_OBTAINED_BROWN: 
        {
            set_inline_visibility("globe_glo_brown", 1);
            set_inline_visibility("globe_glo_disabled", 0);

            break;
        }

        case ECCO1_GLOBE_OBTAINED_PURPLE: 
        {
            set_inline_visibility("globe_glo_purple", 1);
            set_inline_visibility("globe_glo_disabled", 0);

            break;
        }

        case ECCO1_GLOBE_OBTAINED_GREEN: 
        {
            set_inline_visibility("globe_glo_green", 1);
            set_inline_visibility("globe_glo_disabled", 0);

            break;
        }

        case ECCO1_GLOBE_OBTAINED_PURPLE5: 
        {
            set_inline_visibility("globe_glo_purple5", 1);
            set_inline_visibility("globe_glo_disabled", 0);

            break;
        }

        case ECCO1_GLOBE_OBTAINED_PURPLE6: 
        {
            set_inline_visibility("globe_glo_purple6", 1);
            set_inline_visibility("globe_glo_disabled", 0);

            break;
        }

        case ECCO1_GLOBE_OBTAINED_PURPLE7: 
        {
            set_inline_visibility("globe_glo_purple7", 1);
            set_inline_visibility("globe_glo_disabled", 0);

            break;
        }
    }

    if (unlimited_air == ECCO1_UNLIMITED_AIR)
    {
        set_inline_visibility("globe_air_enabled", 1);
        set_inline_visibility("globe_air_disabled", 0);
    }

    if (charge_sonar == ECCO1_CHARGE_SONAR)
    {
        set_inline_visibility("globe_cha_enabled", 1);
        set_inline_visibility("globe_cha_disabled", 0);
    }

    if (perma_kill == ECCO1_PERMA_KILL)
    {
        set_inline_visibility("globe_kil_enabled", 1);
        set_inline_visibility("globe_kil_disabled", 0);
    }
}

function ecco1_main(instance)
{
    enable_menu2(instance, get_ecco_table_game_menu(), menu_ecco_game_handler);
    enable_menu2(instance, get_ecco1md_table_goat_menu(), menu_ecco1md_goat_handler);
    enable_menu(instance, get_menu_ecco1_scenario_resource(), menu_ecco1_scenario_handler);
    enable_menu2(instance, get_ecco1md_table_stage_menu(), menu_ecco1_stage_handler);
    enable_menu2(instance, get_ecco1jpmd_table_stage_menu(), menu_ecco1_stage_handler);
    enable_menu2(instance, get_ecco1cd_table_stage_menu(), menu_ecco1_stage_handler);
    enable_menu(instance, get_menu_ecco1_stage_event_resource(), menu_ecco1_stage_event_handler);
    enable_menu(instance, get_menu_ecco1_globe_obtained_resource(), menu_ecco1_globe_obtained_handler);
    enable_menu(instance, get_menu_ecco1_death_counter_resource(), menu_ecco1_death_counter_handler);

    set_event_listener(instance, "ecco1md_control_goat", "panel_ecco1md_goat", "click", handler_show_panel);
    set_event_listener(instance, "ecco1_control_scenarios", "panel_ecco1_scenarios", "click", handler_show_panel);
    set_event_listener(instance, "ecco_control_game", "panel_game", "click", handler_show_panel);
    set_event_listener(instance, "ecco2_control_game", "panel_game", "click", handler_show_panel);
    set_event_listener(instance, "ecco1_control_stage_event", "panel_ecco1_stage_event", "click",  handler_show_panel);
    set_event_listener(instance, "ecco1_control_globe_obtained", "panel_ecco1_globe_obtained", "click", handler_show_panel);
    set_event_listener(instance, "ecco1_control_death_counter", "panel_ecco1_death_counter", "click", handler_show_panel);

    set_event_listener(instance, "ecco1_control_stage", 0, "click", (value) =>
    {
        let session = instance.ecco1_session;

        disable_all_panels();

        if (session.mode == ECCO1JP_MEGADRIVE)
            set_block_visibility("panel_ecco1jpmd_stage", 1);
        else if (session.mode == ECCO1_SEGACD)
            set_block_visibility("panel_ecco1cd_stage", 1);
        else set_block_visibility("panel_ecco1_stage", 1);
    });

    set_event_listener(instance, "control_about_ok", 0, "click", (value) =>
    {
        let version = instance.version;

        disable_all_panels();
        switch (version)
        {
            case ECCO1_MEGADRIVE:
            case ECCO1JP_MEGADRIVE:
            case ECCO1_SEGACD:
                set_block_visibility("panel_ecco1", 1);
                break;
            case ECCO2_MEGADRIVE:
                set_block_visibility("panel_ecco2", 1);
                break;
        }

    });

    set_event_listener(instance, "ecco1_switch_50_frames_on", 0, "click", ecco1_switch_50_frames);
    set_event_listener(instance, "ecco1_switch_50_frames_off", 1, "click", ecco1_switch_50_frames);
    set_event_listener(instance, "ecco1_switch_air_on", 0, "click", ecco1_switch_air);
    set_event_listener(instance, "ecco1_switch_air_off", 1, "click", ecco1_switch_air);
    set_event_listener(instance, "ecco1_switch_charge_on", 0, "click", ecco1_switch_charge);
    set_event_listener(instance, "ecco1_switch_charge_off", 1, "click", ecco1_switch_charge);
    set_event_listener(instance, "ecco1_switch_kill_on", 0, "click", ecco1_switch_kill);
    set_event_listener(instance, "ecco1_switch_kill_off", 1, "click", ecco1_switch_kill);
    set_event_listener(instance, "ecco_switch_debug_mode_on", 0, "click", ecco_switch_debug_mode);
    set_event_listener(instance, "ecco_switch_debug_mode_off", 1, "click", ecco_switch_debug_mode);
    set_event_listener(instance, "ecco1_switch_cheat_mode_on", 0, "click", ecco_switch_cheat_mode);
    set_event_listener(instance, "ecco1_switch_cheat_mode_off", 1, "click", ecco_switch_cheat_mode);
    set_event_listener(instance, "ecco_switch_developer_mode_on", 0, "click", ecco_switch_developer_mode);
    set_event_listener(instance, "ecco_switch_developer_mode_off", 1, "click", ecco_switch_developer_mode);

    set_event_listener(instance, "ecco1_textin_decoded_password", 0, "keyup", (value) => {
        let raw_password = document.getElementById("ecco1_textin_decoded_password").value;
        decode_ecco1_password(instance, raw_password);
    });

    menu_ecco_game_handler(instance, null, get_ecco_table_game_menu());
}
