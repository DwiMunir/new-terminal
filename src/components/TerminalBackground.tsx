// Background: real Terminal Kutoarjo photo, darkened for readability.
// Source: "Terminal Kutoarjo Kab.Purworejo.jpg" by SATELITBM, Wikimedia Commons,
// CC BY-SA 4.0. Swap public/terminal-bg.jpg to change it.
export function TerminalBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950"
    >
      {/* terminal photo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: 'url(/image.png)' }}
      />
      {/* gradient overlay: darker at top (hero text) & bottom, photo shows through the middle */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/35 to-slate-950/92" />

      {/* amber station glow */}
      <div className="animate-glow absolute left-1/2 top-[-12%] h-[26rem] w-[42rem] rounded-full bg-amber-500/15 blur-[120px]" />

      {/* subtle dot grid, fading downward */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(148,163,184,0.08)_1px,transparent_1.3px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
    </div>
  )
}
