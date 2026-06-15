"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Music, Mic2, Guitar, Users, Calendar,
    CheckCircle2, Sparkles, ChevronRight, ChevronLeft,
    PartyPopper, Phone, Mail, Clock, MapPin, ArrowRight
} from "lucide-react";
import Image from "next/image";

// ─── Data (identical to original) ────────────────────────────────────────────

const EVENT_TYPES = [
    "Private House Party", "Wedding", "Wedding Reception",
    "Sangeet / Mehendi", "Corporate Soirée", "Birthday Party",
    "Anniversary Celebration", "Bachelorette / Bachelor Party",
    "Villa / Destination Party", "Other",
];

const MUSIC_STYLES = [
    { id: "sufi",             label: "Sufi / Qawwali Fusion" },
    { id: "retro",            label: "Retro Classics (60s–90s)" },
    { id: "bollywood",        label: "Bollywood (Old + New Mix)" },
    { id: "bollywood_latest", label: "Pure Bollywood Latest" },
    { id: "acoustic",         label: "Acoustic / Unplugged" },
    { id: "indie",            label: "Indie / Pop" },
    { id: "lounge",           label: "Lounge / Jazz" },
    { id: "rock",             label: "Rock (Soft / Classic)" },
    { id: "ghazals",          label: "Ghazals" },
    { id: "fusion",           label: "Fusion (Indian + Western)" },
    { id: "theme",            label: "Theme-based" },
];

const VIBE_CONFIGS: Record<string, { vocals: string[]; instruments: string[] }> = {
    sufi:             { vocals: ["Male Lead Vocal", "Female Lead Vocal", "Male + Female Duet", "Qawwali Group (2–3 singers)"], instruments: ["Harmonium", "Tabla", "Dholak", "Acoustic Guitar", "Cajon", "Keyboard", "Bass Guitar"] },
    retro:            { vocals: ["Male Vocal", "Female Vocal", "Duet Vocal"],                                                   instruments: ["Acoustic Guitar", "Electric Guitar", "Keyboard", "Tabla", "Dholak", "Cajon", "Bass Guitar"] },
    bollywood:        { vocals: ["Male Vocal", "Female Vocal", "Male + Female Duo"],                                            instruments: ["Acoustic Guitar", "Electric Guitar", "Keyboard", "Cajon", "Drum Kit", "Tabla", "Bass Guitar"] },
    bollywood_latest: { vocals: ["Male Vocal", "Female Vocal", "Male + Female Duo"],                                            instruments: ["Acoustic Guitar", "Electric Guitar", "Keyboard", "Drum Kit", "Bass Guitar", "Octapad"] },
    acoustic:         { vocals: ["Male Vocal", "Female Vocal", "Duo Vocal"],                                                    instruments: ["Acoustic Guitar", "Cajon", "Minimal Keyboard"] },
    lounge:           { vocals: ["Female Jazz Vocal", "Male Lounge Vocal", "Instrumental Only"],                                instruments: ["Keyboard", "Electric Guitar", "Bass Guitar", "Cajon / Drum Kit", "Saxophone"] },
    rock:             { vocals: ["Male Rock Vocal", "Female Rock Vocal"],                                                       instruments: ["Electric Guitar (Lead)", "Electric Guitar (Rhythm)", "Bass Guitar", "Drum Kit", "Keyboard"] },
    indie:            { vocals: ["Male Vocal", "Female Vocal", "Duo"],                                                          instruments: ["Acoustic Guitar", "Keyboard", "Cajon", "Bass Guitar"] },
    ghazals:          { vocals: ["Male Vocal", "Female Vocal"],                                                                 instruments: ["Harmonium", "Tabla", "Sitar", "Violin"] },
    fusion:           { vocals: ["Male Vocal", "Female Vocal", "Duo"],                                                          instruments: ["Sitar", "Violin", "Flute", "Electric Guitar", "Drums", "Tabla"] },
    theme:            { vocals: ["Custom Vocalist"],                                                                             instruments: ["Custom Setup"] },
};

const BAND_SIZES = ["Solo", "Duo", "Trio", "4-Piece Band", "5-Piece Band", "Full Band (6+)"];

// ─── Step metadata ────────────────────────────────────────────────────────────
const STEPS = [
    { num: "01", label: "Event Type"      },
    { num: "02", label: "Music Vibe"      },
    { num: "03", label: "Configure Sound" },
    { num: "04", label: "Band Size"       },
    { num: "05", label: "Event Details"   },
    { num: "06", label: "Your Band"       },
];

// ─── Image maps ───────────────────────────────────────────────────────────────
const EVENT_IMG: Record<string, string> = {
    "Wedding":                       "/images/wedding_sangeet_vibe.png",
    "Wedding Reception":             "/images/wedding_reception_vibe.png",
    "Sangeet / Mehendi":             "/images/wedding_sangeet_vibe.png",
    "Private House Party":           "/images/bollywood_party_vibe.png",
    "Birthday Party":                "/images/birthday_party_vibe.png",
    "Bachelorette / Bachelor Party": "/images/bachelorette_vibe.png",
    "Villa / Destination Party":     "/images/villa_party_vibe.png",
    "Corporate Soirée":              "/images/corporate_soiree_vibe.png",
    "Anniversary Celebration":       "/images/anniversary_vibe.png",
    "Other":                         "/images/default_band_start.png",
};

const VIBE_IMG: Record<string, string> = {
    "sufi":             "/images/sufi_qawwali_vibe.png",
    "retro":            "/images/retro_music_vibe.png",
    "bollywood":        "/images/bollywood_music_vibe.png",
    "bollywood_latest": "/images/bollywood_party_vibe.png",
    "acoustic":         "/images/acoustic_lounge_vibe.png",
    "indie":            "/images/indie_music_vibe.png",
    "lounge":           "/images/lonavala_live_band.png",
    "rock":             "/images/band_music_vibe.png",
    "ghazals":          "/images/sufi_qawwali_vibe.png",
    "fusion":           "/images/band_builder_event.png",
    "theme":            "/images/band_builder_event.png",
};

// ─── Shared tokens ────────────────────────────────────────────────────────────
const G  = "#C9A84C";
const CB = "bg-[#0d0a05]";
const CC = "border-[#251c08]";
const CH = "hover:border-[#C9A84C]/50 hover:bg-[#151005]";
const CA = "border-[#C9A84C] bg-[#1a1308]";
const TO = "bg-[#C9A84C]/15 border-[#C9A84C] text-[#C9A84C] font-bold";
const TF = "border-[#251c08] text-white font-semibold hover:border-[#C9A84C]/50 hover:bg-[#151005]/50";

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 active:scale-95 ${on ? TO : TF}`}>
            {label}
        </button>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BandBuilder({ onRequestQuote }: { onRequestQuote?: (d: any) => void }) {
    const [step, setStep]     = useState(1);
    const [dir,  setDir]      = useState(1);
    const [modal, setModal]   = useState(false);
    const [minDate, setMinDate] = useState("");

    // Selections
    const [eventType,   setEventType]   = useState("");
    const [musicStyles, setMusicStyles] = useState<string[]>([]);
    const [vibeConfigs, setVibeConfigs] = useState<Record<string, { vocals: string[]; instruments: string[] }>>({});
    const [bandSize,    setBandSize]    = useState("");
    const [date,        setDate]        = useState("");
    const [city,        setCity]        = useState("");
    const [venueType,   setVenueType]   = useState("");
    const [duration,    setDuration]    = useState("");
    const [customDur,   setCustomDur]   = useState("");

    useEffect(() => {
        const t = new Date();
        setMinDate(`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`);
    }, []);

    const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };
    const next = () => step < 6 && go(step + 1);
    const prev = () => step > 1 && go(step - 1);

    const toggleStyle = (id: string) =>
        setMusicStyles(p => p.includes(id) ? [] : [id]);

    const updateVibe = (vibeId: string, type: "vocals"|"instruments", item: string) => {
        const cur = vibeConfigs[vibeId] || { vocals: [], instruments: [] };
        const list = cur[type];
        setVibeConfigs(p => ({ ...p, [vibeId]: { ...cur, [type]: list.includes(item) ? list.filter(i => i !== item) : [...list, item] } }));
    };

    const selectedStyles = MUSIC_STYLES.filter(s => musicStyles.includes(s.id));

    // Dynamic image: music selection > event selection > default
    const contextImage = (() => {
        if (musicStyles.length > 0) return VIBE_IMG[musicStyles[musicStyles.length - 1]] ?? "/images/default_band_start.png";
        if (eventType) return EVENT_IMG[eventType] ?? "/images/default_band_start.png";
        return "/images/default_band_start.png";
    })();

    const WAMsg = () => {
        let m = "Hi! Custom band request:\n\n";
        if (eventType)          m += `📅 Event: ${eventType}\n`;
        if (musicStyles.length) m += `🎵 Vibes: ${musicStyles.map(id => MUSIC_STYLES.find(s=>s.id===id)?.label).join(", ")}\n`;
        if (bandSize)           m += `👥 Size: ${bandSize}\n`;
        selectedStyles.forEach(style => {
            const cfg = vibeConfigs[style.id];
            if (cfg) m += `🎸 ${style.label}: Vocals—${cfg.vocals.join(", ")||"any"} | Instr—${cfg.instruments.join(", ")||"any"}\n`;
        });
        if (date)      m += `📆 Date: ${date}\n`;
        if (city)      m += `📍 Location: ${city}\n`;
        if (venueType) m += `🏛 Venue: ${venueType}\n`;
        if (duration)  m += `⏱ Duration: ${duration==="custom"&&customDur?customDur:duration}\n`;
        m += "\nPlease share pricing & availability. Thank you!";
        
        // 1. Open WhatsApp immediately to prevent browser popup blocking
        window.open(`https://wa.me/7779945379?text=${encodeURIComponent(m)}`, "_blank");

        // 2. Map Event Type and Band Size to strict database enums
        const eventMap: Record<string, string> = {
            "Wedding": "wedding",
            "Wedding Reception": "reception",
            "Sangeet / Mehendi": "sangeet",
            "Private House Party": "house_party",
            "Birthday Party": "birthday",
            "Bachelorette / Bachelor Party": "bachelorette",
            "Villa / Destination Party": "private_party",
            "Corporate Soirée": "corporate",
            "Anniversary Celebration": "anniversary",
            "Other": "other"
        };
        const sizeMap: Record<string, string> = {
            "Solo": "solo",
            "Duo": "duet",
            "Trio": "trio",
            "4-Piece Band": "4piece",
            "5-Piece Band": "full_band",
            "Full Band (6+)": "full_band"
        };

        const dbEvent = eventMap[eventType] || "other";
        const dbSize = sizeMap[bandSize] || "full_band";

        // 3. Log the WhatsApp inquiry silently in the background
        fetch("/api/public/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "WhatsApp Visitor",
                email: "whatsapp-inquiry@thebandcompany.in",
                mobile: "N/A (WhatsApp Click)",
                date: date || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                eventType: dbEvent,
                performanceType: dbSize,
                destination: city || "Not Specified",
                venueName: venueType || "Not Specified",
                message: m,
                selectedPackage: "Custom Band Configuration (WhatsApp Click)"
            })
        }).catch(err => {
            console.error("Failed to silently log WhatsApp lead to CRM:", err);
        });
    };

    const INPUT = "w-full bg-[#0d0a05] border border-[#251c08] rounded-lg px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-white/60 appearance-none [color-scheme:dark]";
    const LABEL = "text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-1 block";

    // ── Step content ──────────────────────────────────────────────────────────
    const renderContent = () => {
        switch (step) {
            // Step 1: Event Type
            case 1: return (
                <div className="grid grid-cols-2 gap-3">
                    {EVENT_TYPES.map(t => (
                        <button key={t} onClick={() => { setEventType(e => e===t?"":t); }}
                            className={`px-4 py-4 rounded-lg border text-left text-base font-bold transition-all duration-150 active:scale-[0.98] flex items-center justify-between group
                                ${eventType===t ? CA : `${CB} ${CC} ${CH} text-white`}`}>
                            <span className={eventType===t ? "text-[#C9A84C] font-bold" : "text-white font-bold"}>{t}</span>
                            {eventType===t && <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />}
                        </button>
                    ))}
                </div>
            );

            // Step 2: Music Vibe
            case 2: return (
                <div className="grid grid-cols-2 gap-3">
                    {MUSIC_STYLES.map(s => {
                        const on = musicStyles.includes(s.id);
                        return (
                            <button key={s.id} onClick={() => toggleStyle(s.id)}
                                className={`px-4 py-4 rounded-lg border text-left text-base font-bold transition-all duration-150 active:scale-[0.98] flex items-center justify-between
                                    ${on ? CA : `${CB} ${CC} ${CH} text-white`}`}>
                                <div className="flex items-center gap-2.5">
                                    <Music className="w-4 h-4 shrink-0 text-[#C9A84C]" />
                                    <span className={`font-bold ${on ? "text-[#C9A84C]" : "text-white"}`}>{s.label}</span>
                                </div>
                                {on && <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            );

            // Step 3: Configure
            case 3: return selectedStyles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <Music className="w-10 h-10 text-[#C9A84C]" />
                    <p className="text-white text-base font-bold">Go back and select at least one music vibe first.</p>
                    <button onClick={prev} className="text-[#C9A84C] text-sm font-bold underline">← Pick a Vibe</button>
                </div>
            ) : (
                <div className="space-y-4 overflow-y-auto pr-1 max-h-full scrollbar-hide">
                    {selectedStyles.map(style => {
                        const config   = VIBE_CONFIGS[style.id] || VIBE_CONFIGS["indie"];
                        const userConf = vibeConfigs[style.id] || { vocals: [], instruments: [] };
                        return (
                            <div key={style.id} className={`${CB} border ${CC} rounded-xl p-4`}>
                                <p className="text-[#C9A84C] text-sm font-bold flex items-center gap-1.5 mb-3">
                                    <Sparkles className="w-3.5 h-3.5" /> {style.label}
                                </p>
                                <div className="mb-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-2 flex items-center gap-1"><Mic2 className="w-3.5 h-3.5" /> Vocals</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {config.vocals.map(v => <Tag key={v} label={v} on={userConf.vocals.includes(v)} onClick={() => updateVibe(style.id,"vocals",v)} />)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-2 flex items-center gap-1"><Guitar className="w-3.5 h-3.5" /> Instruments</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {config.instruments.map(i => <Tag key={i} label={i} on={userConf.instruments.includes(i)} onClick={() => updateVibe(style.id,"instruments",i)} />)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );

            // Step 4: Band Size
            case 4: return (
                <div className="grid grid-cols-2 gap-3">
                    {BAND_SIZES.map(size => (
                        <button key={size} onClick={() => setBandSize(s => s===size?"":size)}
                            className={`py-6 px-4 rounded-xl border text-center flex flex-col items-center gap-2.5 transition-all duration-150 active:scale-[0.98]
                                ${bandSize===size ? CA : `${CB} ${CC} ${CH}`}`}>
                            <Users className="w-6 h-6 text-[#C9A84C]" />
                            <span className={`text-base font-bold ${bandSize===size ? "text-[#C9A84C]" : "text-white"}`}>{size}</span>
                        </button>
                    ))}
                </div>
            );

            // Step 5: Event Details
            case 5: return (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL}>Event Date</label>
                            <input type="date" min={minDate||undefined} className={INPUT} onChange={e=>setDate(e.target.value)} />
                        </div>
                        <div>
                            <label className={LABEL}>City / Location</label>
                            <input type="text" placeholder="e.g. Mumbai, Goa" className={INPUT} onChange={e=>setCity(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL}>Venue Type</label>
                            <select className={INPUT} onChange={e=>setVenueType(e.target.value)}>
                                <option value="">Select...</option>
                                <option>Indoor Banquet</option>
                                <option>Outdoor Lawn</option>
                                <option>Private Villa</option>
                                <option>Club / Lounge</option>
                            </select>
                        </div>
                        <div>
                            <label className={LABEL}>Duration</label>
                            <select className={INPUT} value={duration} onChange={e=>{setDuration(e.target.value);if(e.target.value!=="custom")setCustomDur("");}}>
                                <option value="">Select...</option>
                                <option value="2.5 Hours">2.5 Hrs (Standard)</option>
                                <option value="3.5 Hours">3.5 Hrs (Extended)</option>
                                <option value="4.5 Hours">4.5 Hrs (Full Evening)</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                    </div>
                    {duration==="custom" && (
                        <input type="text" placeholder="e.g. 5 hours" value={customDur} onChange={e=>setCustomDur(e.target.value)} className={INPUT} />
                    )}
                </div>
            );

            // Step 6: Summary
            case 6: return (
                <div className="space-y-3 overflow-y-auto scrollbar-hide max-h-full">
                    <div className={`${CB} border ${CC} rounded-xl p-4 space-y-3`}>
                        {eventType && <Row label="Event"    value={eventType} />}
                        {musicStyles.length>0 && <Row label="Vibes" value={musicStyles.map(id=>MUSIC_STYLES.find(s=>s.id===id)?.label).join(", ")} />}
                        {bandSize  && <Row label="Band Size" value={bandSize} />}
                        {date      && <Row label="Date"     value={date} />}
                        {city      && <Row label="Location" value={city} />}
                        {venueType && <Row label="Venue"    value={venueType} />}
                        {duration  && <Row label="Duration" value={duration==="custom"&&customDur?customDur:duration} />}
                        {!eventType && !musicStyles.length && (
                            <p className="text-white/20 text-xs italic text-center py-2">No selections yet — go back and fill in your preferences.</p>
                        )}
                    </div>
                    <button onClick={WAMsg}
                        className="w-full py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 transition-colors">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        Book via WhatsApp
                    </button>
                    <button onClick={()=>onRequestQuote?.({eventType,musicStyles,vibeConfigs,bandSize,eventDetails:{date,city,venueType,duration:duration==="custom"?customDur:duration}})}
                        className="w-full py-3 bg-[#C9A84C] hover:bg-[#b8963e] text-black text-sm font-bold rounded-full flex items-center justify-center gap-2 transition-colors">
                        <Mail className="w-4 h-4" /> Request Quote via Email
                    </button>
                    <button onClick={()=>setModal(true)}
                        className="w-full py-2.5 border border-[#C9A84C] text-[#C9A84C] text-sm font-bold rounded-full hover:bg-[#151005]/50 transition-colors">
                        Get Expert Recommendation
                    </button>
                </div>
            );

            default: return null;
        }
    };

    const stepMeta = STEPS[step - 1];

    return (
        <div className="w-full h-[90dvh] md:h-[90vh] flex items-stretch bg-[#080602] overflow-hidden rounded-2xl relative">

            {/* ── MOBILE DYNAMIC BACKGROUND ── */}
            <div className="md:hidden absolute inset-0 z-0 pointer-events-none opacity-40">
                <AnimatePresence>
                    <motion.div key={contextImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                        <Image src={contextImage} alt={stepMeta.label} fill className="object-cover" priority />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0703] via-[#0a0703]/80 to-transparent" />
            </div>

            {/* ── LEFT PANEL — Image + step info ── */}
            <div className="hidden md:flex w-[42%] shrink-0 relative flex-col overflow-hidden bg-[#0d0a05] z-10">
                <AnimatePresence>
                    <motion.div key={contextImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                        <Image src={contextImage} alt={stepMeta.label} fill className="object-cover" priority />
                    </motion.div>
                </AnimatePresence>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                {/* Brand */}
                <div className="relative z-10 p-8">
                    <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.3em]">The Band Company</p>
                </div>

                {/* Step label */}
                <div className="relative z-10 mt-auto p-8">
                    <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest mb-2">{stepMeta.num} / 06</p>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                        Craft Your<br /><span className="text-[#C9A84C]">Dream Band</span>
                    </h2>
                    <p className="text-white text-sm font-semibold mt-2 max-w-[220px]">Design a live music experience as unique as your celebration.</p>

                    {/* Mini progress dots */}
                    <div className="flex gap-1.5 mt-6">
                        {STEPS.map((s, i) => (
                            <button key={s.num} onClick={() => go(i+1)}
                                className={`h-1 rounded-full transition-all duration-300 ${step===i+1 ? "w-6 bg-[#C9A84C]" : step>i+1 ? "w-3 bg-[#C9A84C]/50" : "w-3 bg-white/15"}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL — Step content ── */}
            <div className="flex-1 flex flex-col bg-transparent md:bg-[#0a0703] overflow-hidden z-10 relative">

                {/* Top bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1408] bg-[#0a0703]/60 backdrop-blur-md md:bg-transparent md:backdrop-blur-none shrink-0 relative z-20">
                    <div>
                        <p className="text-[#C9A84C] text-2xl md:text-3xl font-bold tracking-wider">{stepMeta.num} — {stepMeta.label}</p>
                        <p className="text-white text-base font-semibold mt-1.5">Step {step} of 6</p>
                    </div>
                    {/* Step tabs — compact */}
                    <div className="hidden sm:flex items-center gap-2">
                        {STEPS.map((s, i) => (
                            <button key={s.num} onClick={() => go(i+1)}
                                className={`w-11 h-11 rounded-full text-sm md:text-base font-bold transition-all duration-200
                                    ${step===i+1 ? "bg-[#C9A84C] text-black" :
                                      step>i+1  ? "bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/40" :
                                                   "bg-[#1a1408] text-white/60 font-bold border border-[#251c08]"}`}>
                                {step > i+1 ? "✓" : s.num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-hide">
                    <AnimatePresence mode="wait" custom={dir}>
                        <motion.div
                            key={step}
                            custom={dir}
                            initial={{ opacity: 0, x: dir > 0 ? 30 : -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: dir > 0 ? -30 : 30 }}
                            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                            className="h-full"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom nav */}
                <div className="shrink-0 px-6 py-4 border-t border-[#1a1408] bg-[#0a0703]/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none flex items-center justify-between gap-4 relative z-20">
                    <button onClick={prev} disabled={step===1}
                        className="flex items-center gap-2 text-sm text-white font-bold hover:text-[#C9A84C] active:scale-95 disabled:active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        <ChevronLeft className="w-4 h-4 text-white" /> Back
                    </button>

                    {/* Live mini-summary chips */}
                    <div className="flex-1 flex flex-wrap gap-1.5 justify-center overflow-hidden max-h-8">
                        {eventType && <MiniChip label={eventType} />}
                        {musicStyles.slice(0,2).map(id=><MiniChip key={id} label={MUSIC_STYLES.find(s=>s.id===id)?.label??""} />)}
                        {musicStyles.length>2 && <MiniChip label={`+${musicStyles.length-2} more`} />}
                        {bandSize && <MiniChip label={bandSize} />}
                    </div>

                    {step < 6 ? (
                        <button onClick={next}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#C9A84C] hover:bg-[#b8963e] active:scale-95 text-black text-sm font-bold rounded-full transition-all shadow-lg shadow-[#C9A84C]/20">
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={WAMsg}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] active:scale-95 text-white text-sm font-bold rounded-full transition-all">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            Book Now
                        </button>
                    )}
                </div>
            </div>

            {/* ── Expert Modal ── */}
            {modal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setModal(false)}>
                    <div className="bg-[#0d0a05] border border-[#251c08] rounded-2xl p-8 max-w-sm w-full"
                        onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-serif text-white mb-1">Expert Recommendation</h3>
                        <p className="text-white text-xs font-semibold mb-5">How would you like to connect?</p>
                        <div className="space-y-2">
                            <a href="https://wa.me/7779945379?text=Hi!%20I%20need%20expert%20recommendation." target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-sm font-bold rounded-full hover:bg-[#20BA5A] transition-colors">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                WhatsApp Chat
                            </a>
                            <a href="tel:7779945379"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-500 transition-colors">
                                <Phone className="w-4 h-4" /> Call Us
                            </a>
                            <button onClick={() => setModal(false)}
                                className="w-full py-2.5 text-white hover:text-white/80 text-xs font-bold transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function MiniChip({ label }: { label: string }) {
    return (
        <span className="text-[10px] text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full px-2 py-0.5 whitespace-nowrap">
            {label}
        </span>
    );
}

function Row({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start justify-between gap-4">
            <p className="text-[11px] uppercase font-bold tracking-widest text-[#C9A84C] shrink-0">{label}</p>
            <p className="text-sm text-white font-semibold text-right">{value}</p>
        </div>
    );
}
