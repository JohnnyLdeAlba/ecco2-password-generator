function t_config() 
{
    this.WSPRITE_ENABLE = 0;
}

function t_user_interface()
{
    this.CTRL_TOTAL = 0;

    this.LinkResource = null;
    this.ControlResource = null;

    this.cfg = null;
    this.ctrl = null;
}

function create_user_interface()
{
    let ui = new t_user_interface();

    ui.ControlResource = get_control_resource();
    ui.LinkResource = get_link_resource(); 
    ui.CTRL_TOTAL = (ui.ControlResource.length / CONTROL_RESOURCE_TOTAL);
    ui.ctrl = new Array();

    create_all_controls(ui);

    return ui;
}

function t_program()
{
    this.cfg = null;
    this.ui = null;
}

function create_program(cfg)
{
    let prg = new t_program();
    let ui = create_user_interface();

    ui.cfg = cfg;

    prg.cfg = cfg;
    prg.ui = ui;

    enable_all_control_handlers(ui);
    enable_all_link_handlers(ui);

    set_panel_visibility('pnl_home', 1);
    window.addEventListener('load', get_token);

    return prg;
}
