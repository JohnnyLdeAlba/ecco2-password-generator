let index = 1000;

let NAV_WSPRITE_ENABLE = index++;
let NAV_WSPRITE_DISABLE = index++;

let GRP_WSPRITE = NAV_WSPRITE_ENABLE;
let GRP_WSPRITE_TOTAL = 2;

function get_panel_resource() 
{
    let table = [
        'pnl_home'
    ];

    return table; 
}

function get_link_resource()
{
    let table = [
        'link_home', 'pnl_home'
    ];

    return table;
} 

function update_group_wsprite(ui, event, control)
{
    let cfg = ui.cfg;

    if (control == null)
    {
        if (cfg.WSPRITE_ENABLE == 1)
            control = get_control(ui, NAV_WSPRITE_ENABLE);
        else
            control = get_control(ui, NAV_WSPRITE_DISABLE);
    }

    let wsprite_enable = control.data;
    cfg.WSPRITE_ENABLE = wsprite_enable;

    if (wsprite_enable == -1) wsprite_enable*= -1;
    set_cookie('wsprite_enable', wsprite_enable, 9999);

    update_control_group
    (
        ui, 
        control.id, 
        GRP_WSPRITE,
        GRP_WSPRITE_TOTAL
    );
}

function get_control_resource()
{
    let table = [

       NAV_WSPRITE_ENABLE,
       'nav_wsprite_enable',
       'menu_item',
       null,
       update_group_wsprite,
       null,
       -1,

       NAV_WSPRITE_DISABLE,
       'nav_wsprite_disable',
       'menu_item',
       null,
       update_group_wsprite,
       null,
       0
    ];

    return table;
}

function get_config()
{
    let cfg = new t_config();
    let result = get_cookie('wsprite_enable');

    if (result == '') result = 1;
    else result = parseInt(result);

    cfg.WSPRITE_ENABLE = result;   
 
    return cfg;
}
