const checkbox_2g = document.querySelector(".checkbox_2g")
        const checkbox_2g_modal = document.querySelector(".checkbox_2g_modal")
        const checkbox_3g = document.querySelector(".checkbox_3g")
        const checkbox_3g_modal = document.querySelector(".checkbox_3g_modal")
        const checkbox_4g = document.querySelector(".checkbox_4g")
        const checkbox_4g_modal = document.querySelector(".checkbox_4g_modal")
        const checkbox_lte450 = document.querySelector(".checkbox_lte450")
        const checkbox_lte450_modal = document.querySelector(".checkbox_lte450_modal")

        
        //связь модального окна с кнопками на большом экране
        checkbox_2g.addEventListener('change', function() {
            checkbox_2g_modal.checked = this.checked;
        });

        checkbox_2g_modal.addEventListener('change', function() {
            checkbox_2g.checked = this.checked;
        });

        checkbox_3g.addEventListener('change', function() {
            checkbox_3g_modal.checked = this.checked;
        });

        checkbox_3g_modal.addEventListener('change', function() {
            checkbox_3g.checked = this.checked;
        });

        checkbox_4g.addEventListener('change', function() {
            checkbox_4g_modal.checked = this.checked;
        });

        checkbox_4g_modal.addEventListener('change', function() {
            checkbox_4g.checked = this.checked;
        });

        checkbox_lte450.addEventListener('change', function() {
            checkbox_lte450_modal.checked = this.checked;
        });

        checkbox_lte450_modal.addEventListener('change', function() {
            checkbox_lte450.checked = this.checked;
        });

        const op_but = document.getElementById('openModal2');
        const filt_mod = document.getElementById('FiltModal');
        const close_but = document.getElementById('closeModal2');
        op_but.addEventListener('click',()=>{
            filt_mod.classList.remove('hidden');
            filt_mod.classList.add('flex');
        })
        close_but.addEventListener('click', ()=>{
            closeModal();
        })
        document.addEventListener('resize', ()=>{
            if(document.documentElement.clientWidth < 1024) {
            document.getElementById('filt_cover').classList.add('hidden')
            }
        })
        op_but.addEventListener('click', () => {
            filt_mod.classList.remove('hidden');
            setTimeout(() => {
                filt_mod.classList.remove('opacity-0');
                filt_mod.classList.add('flex');    
                filt_mod.classList.add('opacity-100');
            }, 10);
        });

        const closeModal = () => {
            filt_mod.classList.remove('opacity-100');
            filt_mod.classList.add('opacity-0');
            filt_mod.classList.remove('flex');   
            setTimeout(() => {
            filt_mod.classList.add('hidden');
            }, 10);
        };

        close_but.addEventListener('click', closeModal);