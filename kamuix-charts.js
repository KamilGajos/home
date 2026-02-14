        class KamuixChart {
            constructor(containerId, config) {
                this.container = document.getElementById(containerId);
                this.config = config;
                this.render();
            }

            getBorderRadius() {
                const c = this.config.bars?.corners;
                const r = this.config.bars?.radius || 20;
                return c ? `${c.tl || 0}px ${c.tr || 0}px ${c.br || 0}px ${c.bl || 0}px` : `${r}px ${r}px 4px 4px`;
            }

            mapColor(color) {
                const colors = {
                    indigo: 'from-indigo-600 to-indigo-400',
                    rose: 'from-rose-500 to-rose-400',
                    emerald: 'from-emerald-500 to-emerald-400'
                };
                return colors[color] || colors.indigo;
            }

            render() {
                const { title, subtitle, data, badge, unit } = this.config;
                const maxVal = Math.max(...data.map(d => d.value)) || 100;

                this.container.innerHTML = `
                <div class="w-[800px] bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col">
                    
                    <header class="mb-12 flex justify-between items-start">
                        <div>
                            <h2 class="text-3xl font-black text-slate-800 tracking-tight">${title.text}</h2>
                            <p class="text-slate-400 font-medium">${subtitle.text}</p>
                        </div>
                        <div class="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest">${badge}</div>
                    </header>

                    <div class="relative h-80 w-full flex">
                        
                        <div class="w-[5%] flex flex-col justify-between text-[10px] font-bold text-slate-300 pb-[6px] z-20">
                            <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span class="text-slate-400">0%</span>
                        </div>

                        <div class="relative w-[95%] h-full">
                            
                            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                <div class="w-full h-[6px] border-b border-slate-100"></div>
                                <div class="w-full h-[6px] border-b border-slate-100"></div>
                                <div class="w-full h-[6px] border-b border-slate-100"></div>
                                <div class="w-full h-[6px] border-b border-slate-100"></div>
                                <div class="w-full h-[6px] border-b-2 border-slate-200"></div>
                            </div>

                            <div class="absolute inset-0 pt-[6px] pb-[3px] flex items-end justify-around gap-4 z-10 px-4">
                                ${data.map(item => {
                                    const heightRatio = (item.value / maxVal) * 100;
                                    return `
                                    <div class="relative flex-1 flex flex-col justify-end h-full group/bar">
                                        <div class="kamuix-bar w-full bg-gradient-to-t ${this.mapColor(item.color)} 
                                                    hover:brightness-110 hover:scale-x-[1.02] transition-all duration-300 cursor-pointer shadow-sm" 
                                             style="height: 0%; border-radius: ${this.getBorderRadius()};"
                                             data-height="${heightRatio}%">
                                            
                                            <div class="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-1 transition-all duration-300 z-30">
                                                <div class="bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg shadow-xl whitespace-nowrap">${item.value}${unit}</div>
                                                <div class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                            </div>
                                        </div>
                                        <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">${item.label}</span>
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>
                    </div>

                    <footer class="mt-6 pt-4 flex justify-center gap-10">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-indigo-500"></div>
                            <span class="text-[10px] font-bold text-slate-500 uppercase">Przychód</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                            <span class="text-[10px] font-bold text-slate-500 uppercase">Wydatki</span>
                        </div>
                    </footer>
                </div>
                `;
                this.animate();
            }

            animate() {
                gsap.to(this.container.querySelectorAll('.kamuix-bar'), {
                    height: (i, el) => el.dataset.height,
                    duration: 1.4,
                    stagger: 0.1,
                    ease: "power4.out"
                });
            }
        }