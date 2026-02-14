class KamuixChart {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config;
        // Mapowanie nazw na funkcje CSS Easing (cubic-bezier)
        this.easings = {
            "linear": "linear",
            "power1": "cubic-bezier(0.45, 0, 0.55, 1)",
            "power2": "cubic-bezier(0.23, 1, 0.32, 1)",
            "power3": "cubic-bezier(0.19, 1, 0.22, 1)",
            "power4": "cubic-bezier(0.165, 0.84, 0.44, 1)",
            "expo": "cubic-bezier(0.19, 1, 0.22, 1)",
            "back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
            "elastic": "cubic-bezier(0.68, -0.6, 0.32, 1.6)", // Przybliżenie elastic
            "bounce": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            "smooth": "cubic-bezier(0.37, 0, 0.63, 1)",
            "none": "step-end"
        };
        this.render();
    }

    // ... (metody getBorderRadius i mapColor pozostają bez zmian)
    getBorderRadius(item, index) {
        if (item.corners) {
            const c = item.corners;
            return `${c.tl || 0}px ${c.tr || 0}px ${c.br || 0}px ${c.bl || 0}px`;
        }
        if (item.radius !== undefined) return `${item.radius}px ${item.radius}px 4px 4px`;
        const c = this.config.bars?.corners;
        const r = this.config.bars?.radius ?? 20;
        return c ? `${c.tl || 0}px ${c.tr || 0}px ${c.br || 0}px ${c.bl || 0}px` : `${r}px ${r}px 4px 4px`;
    }

    mapColor(item) {
        if (item.img) return '';
        const colors = {
            indigo: 'from-indigo-600 to-indigo-400',
            rose: 'from-rose-500 to-rose-400',
            emerald: 'from-emerald-500 to-emerald-400'
        };
        return colors[item.color] || colors.indigo;
    }

    render() {
    const { data, unit, showLegend = true, showYAxis = true, animation = {} } = this.config;
    const maxVal = Math.max(...data.map(d => d.value)) || 100;
    
    // Ustawienia globalne
    const globalShowValues = this.config.showValues ?? true;
    const globalShowValuesColor = this.config.showValuesColor || '#ffffff';

    const uniqueColors = [...new Set(data.filter(d => d.color).map(d => d.color))];
    const footerHtml = showLegend && uniqueColors.length > 0 ? `
        <footer class="mt-6 pt-4 flex justify-center gap-6 flex-none">
            ${uniqueColors.map(color => `
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-${color}-500"></div>
                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">${color}</span>
                </div>
            `).join('')}
        </footer>` : '';

    this.container.innerHTML = `
        <div class="w-full h-full flex flex-col">
            <div class="relative flex-1 flex min-h-0">
                ${showYAxis ? `
                <div class="w-10 flex flex-col justify-between text-[10px] font-bold text-slate-300 flex-none">
                    <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
                </div>` : ''}

                <div class="relative flex-1 h-full mb-8">
                    <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        ${Array(5).fill('<div class="w-full border-b border-slate-100/80"></div>').join('')}
                    </div>

                    <div class="absolute inset-0 flex items-end justify-around gap-2">
                        ${data.map((item, index) => {
                            const heightRatio = (item.value / maxVal) * 100;
                            const bgStyle = item.img ? `background-image: url('${item.img}'); background-size: cover; background-position: center;` : '';
                            
                            // Animacja
                            const animType = item.animationType || animation.type || "expo";
                            const animDuration = item.animationDuration || animation.duration || 1.2;
                            const animDelay = item.animationDelay !== undefined ? item.animationDelay : (index * (animation.stagger || 0.08));

                            // Kolory i widoczność wartości
                            const showValue = item.showValues !== undefined ? item.showValues : globalShowValues;
                            const textColor = item.showValuesColor || globalShowValuesColor;
                            let colorClass = textColor.includes('-') ? `text-${textColor}` : (textColor.startsWith('#') || textColor.startsWith('rgb') ? '' : `text-${textColor}-600`);
                            let colorStyle = (textColor.startsWith('#') || textColor.startsWith('rgb')) ? `color: ${textColor};` : '';

                            return `
                            <div class="relative flex-1 flex flex-col justify-end h-full group/bar max-w-[80px]">
                                
                                ${this.config.tooltip !== false ? `
                                <div class="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-2 transition-all duration-300 z-50 pointer-events-none"
                                     style="bottom: calc(${heightRatio}% + 8px)">
                                    <div class="bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md shadow-xl whitespace-nowrap font-bold">
                                        ${item.value}${unit || ''}
                                    </div>
                                    <div class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                </div>` : ''}

                                <div class="kamuix-bar w-full cursor-pointer shadow-sm relative overflow-hidden ${item.img ? '' : 'bg-gradient-to-t ' + this.mapColor(item)}" 
                                     style="height: 0%; border-radius: ${this.getBorderRadius(item, index)}; ${bgStyle}"
                                     data-height="${heightRatio}%"
                                     data-type="${animType}"
                                     data-duration="${animDuration}"
                                     data-delay="${animDelay}">
                                    
                                    <div class="absolute left-1/2 -translate-x-1/2 text-[10px] font-bold transition-opacity duration-200 ${showValue ? 'opacity-100' : 'opacity-0'} ${colorClass}"
                                         style="bottom: 50%; transform: translate(-50%, 50%); ${colorStyle}">
                                        ${item.value}${unit || ''}
                                    </div>

                                    ${item.img ? `<div class="absolute inset-0 bg-black/5 group-hover/bar:bg-transparent transition-colors"></div>` : ''}
                                </div>

                                <span class="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                                    ${item.label}
                                </span>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            </div>
            ${footerHtml}
        </div>
    `;
    this.animate();
}

    animate() {
        const bars = this.container.querySelectorAll('.kamuix-bar');
        
        bars.forEach(bar => {
            const targetHeight = bar.dataset.height;
            const duration = parseFloat(bar.dataset.duration) * 1000; // sekundy na ms
            const delay = parseFloat(bar.dataset.delay) * 1000;
            const easingStr = bar.dataset.type;
            const easing = this.easings[easingStr] || this.easings.expo;

            // Uruchomienie Web Animations API
            bar.animate([
                { height: '0%' },
                { height: targetHeight }
            ], {
                duration: duration,
                delay: delay,
                easing: easing,
                fill: 'forwards' // Zachowaj stan końcowy
            });
        });
    }
}
