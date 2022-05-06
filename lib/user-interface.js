const UI_ERROR = -1000;
const UI_NOT_FOUND = -1001;

function set_cookie(id, value, day_total)
{
    let date = new Date();
    date.setTime(date.getTime() + (day_total * 1000 * 60 * 60 * 24));

    let expiration = 'expires=' + date.toUTCString();
    document.cookie = id + '=' + value + ';' + expiration + ';path=/';
}

function get_cookie(id)
{
    let cookie_id = id + '=';
    let raw_cookie = decodeURIComponent(document.cookie);

    let cookie = raw_cookie.split(';');
    let index;

    for(index = 0; index < cookie.length; index++)
    {
        let key = cookie[index];

        while (key.charAt(0) == ' ')
            key = key.substring(1);

        if (key.indexOf(cookie_id) == 0)
            return key.substring(cookie_id.length, key.length);

    }

    return '';
}

function get_table_index(id, table)
{
    let index = 0;

    for (index = 0; index < table.length; index++)
        if (id == table[index])
            return index;

    return UI_NOT_FOUND;
}

function get_table_value(key, table)
{
    let index = 0;

    for (index = 0; index < table.length/2; index++)
    {
        if (key == table[index * 2])
            return table[(index * 2) + 1];
    }

    return null;
}

function get_table2_value(index, table)
{
    if (index < 0 || index >= table.length) return UI_NOT_FOUND;
    return table[index];
}

function get_table_key(value, table)
{
    let index = 0;

    for (index = 0; index < table.length/2; index++)
    {
        if (value == table[(index * 2) + 1])
            return table[index * 2];
    }

    return null;
}

function set_block_visibility(id, visibile)
{
    if (visibile == 1)
    {
        document.getElementById(id).classList.remove("invisible");
        document.getElementById(id).classList.add("visible");
    }
    else
    {
        document.getElementById(id).classList.remove("visible");
        document.getElementById(id).classList.add("invisible");
    }
}

function set_inline_visibility(id, visibile)
{
    if (visibile == 1)
    {
        document.getElementById(id).classList.remove("invisible");
        document.getElementById(id).classList.add("inline");
    }
    else
    {
        document.getElementById(id).classList.remove("inline");
        document.getElementById(id).classList.add("invisible");
    }
}

function set_event_listener(instance, id, value, type, handler)
{
    document.getElementById(id).addEventListener(type, (event) => {

        if (instance == null)
            instance = new Object();

        instance.event = event;
        handler(instance, value);
    });
}

function dialog_panel_highlight(id, table)
{
    let index = 0;

    if (id == "") return;

    for (index = 0; index < table.length/2; index++)
    {
        document.getElementById(table[index * 2]).classList.remove("dialog_panel_highlighted");
        document.getElementById(table[index * 2]).classList.add("dialog_panel");
    }

    if (document.getElementById(id) == null)
        return;

    document.getElementById(id).classList.remove("dialog_panel");
    document.getElementById(id).classList.add("dialog_panel_highlighted");
}

function menu_item_highlight(id, table)
{
    let index = 0;

    for (index = 0; index < table.length/2; index++)
    {
        if (id == table[index * 2])
        {
            document.getElementById(id).classList.remove("menu_item");
            document.getElementById(id).classList.add("menu_item_highlighted");
        }

        else
        {
            document.getElementById(table[index * 2]).classList.remove("menu_item_highlighted");
            document.getElementById(table[index * 2]).classList.add("menu_item");
        }
    }
}

function menu_item_multi_highlight(id, table)
{
    let index = 0;

    for (index = 0; index < table.length/2; index++)
    {
        if (id == table[index * 2])
        {
            document.getElementById(id).classList.remove("menu_item");
            document.getElementById(id).classList.add("menu_item_highlighted");
        }
    }
}

function enable_menu(instance, table, handler)
{
    let index = 0;

    for (index = 0; index < table.length/2; index++)
        document.getElementById(table[index * 2])
            .addEventListener("click", (e) => { handler(instance, e.currentTarget.id, table); });
}

function menu2_item_highlight(id, table)
{
    let index = 0;

    for (index = 0; index < table.length; index++)
    {
        if (id == table[index])
        {
            document.getElementById(id).classList.remove("menu_item");
            document.getElementById(id).classList.add("menu_item_highlighted");
        }

        else
        {
            document.getElementById(table[index]).classList.remove("menu_item_highlighted");
            document.getElementById(table[index]).classList.add("menu_item");
        }
    }
}

function enable_menu2(instance, table, handler)
{
    let index = 0;

    for (index = 0; index < table.length; index++)
    {
        document.getElementById(table[index]).addEventListener("click", (e) =>
        {
            instance.event = e;
            handler(instance, e.currentTarget.id, table); 
        });
    }
}

function switch_toggle(id, value)
{
    set_block_visibility(id+"_on", 0);
    set_block_visibility(id+"_off", 0);

    if (value == 0)
        set_block_visibility(id+"_off", 1);
    else 
        set_block_visibility(id+"_on", 1);
}
