function t_config() 
{
    this.WSPRITE_ENABLE = 0;
    this.WSPRITE_PATH = '';
}

function t_program()
{
    this.cfg = null;
    this.w_sprite = null;
}

function create_program(prg)
{
    let cfg = prg.cfg;

    let w_sprite = new Array();

    prg.cfg = cfg;

    let index; for (index = 0; index < W_SPRITE_TOTAL; index++)
        w_sprite[index] = create_web_sprite(cfg.WSPRITE_PATH, index);

    setInterval(() => {

        let cfg = prg.cfg;
        let total = w_sprite.length;

        for (index = 0; index < total; index++)
        {
            if (cfg.WSPRITE_ENABLE ==  -1)
            {
                if (w_sprite[index].process == null)
                    enable_sprite(w_sprite[index]);
                else cfg.WSPRITE_ENABLE = 1;        
            }

            else if (cfg.WSPRITE_ENABLE == 1)
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

    return prg;
}
