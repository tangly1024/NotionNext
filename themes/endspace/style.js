/**
 * Endspace Theme - Global Styles (JSX)
 * Light Industrial / Endfield-inspired aesthetic
 */

export const Style = () => {
  return (
    <style jsx global>{`
      /* ============================================
         CSS Custom Properties - Light Industrial Theme
         ============================================ */
      :root {
        /* Ethereal Whites & Grays */
        --endspace-bg-base: #fafafa;
        --endspace-bg-primary: #ffffff;
        --endspace-bg-secondary: #f4f4f5;
        --endspace-bg-tertiary: #e4e4e7;
        
        /* Dark Text (High Contrast) */
        --endspace-text-primary: #18181b;
        --endspace-text-secondary: #52525b;
        --endspace-text-muted: #a1a1aa;
        
        /* Accents (Subtle Industrialism) -> Converted to Yellow Suite */
        --endspace-accent-yellow: #FBFB45;
        --endspace-accent-yellow-dim: rgba(251, 251, 69, 0.15);
        --endspace-accent-cyan: #FBFB45; /* OVERRIDE: Cyan usage -> Yellow 500 */
        --endspace-accent-cyan-dim: rgba(251, 251, 69, 0.1); /* OVERRIDE: Cyan dim -> Yellow dim */
        
        /* Borders & Lines */
        --endspace-border-base: #e4e4e7;
        --endspace-border-active: #FBFB45; /* Active border -> Yellow */
        --endspace-grid-color: rgba(0,0,0,0.03);
        
        /* Shadows - Enhanced 3D Depth */
        --endspace-shadow-base: 
          0 1px 2px rgba(0, 0, 0, 0.04),
          0 2px 4px rgba(0, 0, 0, 0.04),
          0 4px 8px rgba(0, 0, 0, 0.04);
        --endspace-shadow-hover: 
          0 4px 8px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.06),
          0 16px 32px rgba(0, 0, 0, 0.04),
          0 0 0 1px var(--endspace-accent-yellow);
      }

      /* Dark Mode Variables */
      .dark {
        --endspace-bg-base: #09090b;
        --endspace-bg-primary: #18181b;
        --endspace-bg-secondary: #27272a;
        --endspace-bg-tertiary: #3f3f46;
        
        --endspace-text-primary: #fafafa;
        --endspace-text-secondary: #a1a1aa;
        --endspace-text-muted: #71717a;
        
        --endspace-accent-yellow: #FBFB45;
        --endspace-accent-yellow-dim: rgba(251, 251, 69, 0.15);
        --endspace-accent-cyan: #FBFB45; /* Dark Mode: Yellow 600 */
        --endspace-accent-cyan-dim: rgba(251, 251, 69, 0.1);
        
        --endspace-border-base: #27272a;
        --endspace-border-active: #FBFB45;
        --endspace-grid-color: rgba(255,255,255,0.02);
        
        --endspace-shadow-base: 
          0 1px 2px rgba(0, 0, 0, 0.2),
          0 2px 4px rgba(0, 0, 0, 0.15),
          0 4px 8px rgba(0, 0, 0, 0.1);
        --endspace-shadow-hover: 
          0 4px 8px rgba(0, 0, 0, 0.3),
          0 8px 16px rgba(0, 0, 0, 0.25),
          0 16px 32px rgba(0, 0, 0, 0.2),
          0 0 0 1px var(--endspace-accent-yellow);
      }

      /* ============================================
         Viewport Scaling (Responsive Font Size)
         ============================================ */
      html {
        /* CSS fallback for viewport scaling when JS not loaded */
        /* Desktop: scale based on viewport width relative to 1440px base (larger content) */
        font-size: clamp(14px, calc(16px * (100vw / 1440)), 24px);
      }
      
      /* Portrait/Mobile orientation: different scaling base */
      @media (orientation: portrait), (max-width: 767px) {
        html {
          font-size: clamp(14px, calc(16px * (100vw / 390)), 20px);
        }
      }

      /* ============================================
         Global Base Styles
         ============================================ */
      #theme-endspace {
        background-color: var(--endspace-bg-base);
        color: var(--endspace-text-primary);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        overflow-x: hidden;
        /* Custom Tech Cursor - Sharp Spearhead with Heavy Shadow */
        cursor: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M2 2 L12 28 L16 18 L26 14 L2 2 Z' fill='%2318181b' stroke='%23ffffff' stroke-width='1.5' style='filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.3));'/%3E%3C/svg%3E") 2 2, auto;
      }
      
      #theme-endspace a, #theme-endspace button, #theme-endspace [role="button"], #theme-endspace .cursor-pointer {
        /* Pointer Cursor - Target Reticle Style */
        cursor: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M2 2 L12 28 L16 18 L26 14 L2 2 Z' fill='%2362F0F5' stroke='%23000000' stroke-width='1.5' style='filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.3));'/%3E%3Ccircle cx='24' cy='24' r='4' fill='none' stroke='%2362F0F5' stroke-width='2'/%3E%3C/svg%3E") 2 2, pointer;
      }

      /* Technical Grid Background */
      #theme-endspace::before {
        content: '';
        position: fixed;
        inset: 0;
        background-image: 
          linear-gradient(var(--endspace-grid-color) 1px, transparent 1px),
          linear-gradient(90deg, var(--endspace-grid-color) 1px, transparent 1px);
        background-size: 40px 40px;
        z-index: -1;
        pointer-events: none;
      }

      /* ============================================
         Typography & Technical Text
         ============================================ */
      .tech-text {
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-weight: 500;
      }
      
      .tech-num {
        font-family: 'Oswald', sans-serif;
        letter-spacing: 1px;
      }

      /* ============================================
         "Float" Container Styles (Glassmorphism -> Solid Block)
         ============================================ */
      .endspace-frame {
        background: var(--endspace-bg-primary); /* Solid background for floating block effect */
        border: 1px solid var(--endspace-border-base);
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
           0 10px 30px -10px rgba(0,0,0,0.1),
           0 4px 6px -2px rgba(0,0,0,0.05); /* Enhanced shadow for lift */
        z-index: 10;
      }

      .dark .endspace-frame {
        background: #18181b; /* Solid dark background */
        border-color: #3f3f46;
      }

      /* Corner Markers (Minimalist L-shape) */
      .endspace-frame::before {
        content: '';
        position: absolute;
        top: -1px; left: -1px;
        width: 0; height: 0;
        border-top: 3px solid var(--endspace-text-primary);
        border-left: 3px solid var(--endspace-text-primary);
        transition: all 0.3s ease;
        opacity: 0;
        z-index: 20;
      }
      .endspace-frame::after {
        content: '';
        position: absolute;
        bottom: -1px; right: -1px;
        width: 0; height: 0;
        border-bottom: 3px solid var(--endspace-text-primary);
        border-right: 3px solid var(--endspace-text-primary);
        transition: all 0.3s ease;
        opacity: 0;
        z-index: 20;
      }

      /* Active State: Heavy Corners appear */
      .endspace-frame:hover {
        border-color: var(--endspace-border-active);
        box-shadow: var(--endspace-shadow-hover);
        transform: translateY(-2px);
      }
      .endspace-frame:hover::before, .endspace-frame:hover::after {
        opacity: 1;
        width: 16px; height: 16px;
      }

      /* ============================================
         Card Styles - Enhanced 3D Depth
         ============================================ */
      .endspace-card {
        background: var(--endspace-bg-primary); /* Solid background */
        border: 1px solid var(--endspace-border-base);
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--endspace-shadow-base);
      }

      .endspace-card:hover {
        border-color: var(--endspace-border-active);
        box-shadow: 
          0 20px 25px -5px rgba(0, 0, 0, 0.1), 
          0 10px 10px -5px rgba(0, 0, 0, 0.04),
          0 0 0 1px var(--endspace-accent-yellow); /* Glow border */
        transform: translateY(-4px) scale(1.01);
        z-index: 20;
      }
      
      .dark .endspace-card {
         background: #18181b;
      }

      /* ============================================
         Notion Content Overrides (Light Mode)
         ============================================ */
      #notion-article {
        color: var(--endspace-text-primary);
        font-size: 1.05rem;
        line-height: 1.75;
      }

      /* Headers - NieR: Automata Style Dynamic Shadow */
      /* Requirement: Misaligned when not hovered, Merged when hovered */
      #notion-article h1, #notion-article h2, #notion-article h3 {
        color: var(--endspace-text-primary);
        font-weight: 800;
        margin-top: 2.5em;
        margin-bottom: 1em;
        position: relative;
        padding-left: 1rem;
        letter-spacing: 0.02em; /* Slightly wider spacing for the 'digital' look */
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Snappy tech transition */
        
        /* Default: Distinctly Misaligned / Interlaced Layers */
        /* Layer 1: Cyan Ghost (Top Left) */
        /* Layer 2: Red/Dark Ghost (Bottom Right) */
        text-shadow: 
          -4px -2px 0 rgba(6, 182, 212, 0.5), 
          4px 2px 0 rgba(255, 50, 50, 0.3);
          
        /* Subtle opacity drop to emphasize the 'hologram' feel when idle */
        opacity: 0.85; 
      }
      
      /* Hover: Merge / Snap to focus */
      #notion-article h1:hover, #notion-article h2:hover, #notion-article h3:hover {
        /* Shadows merge into the text */
        text-shadow: 
          0 0 0 rgba(6, 182, 212, 0),
          0 0 0 rgba(255, 50, 50, 0);
        opacity: 1;
        transform: translateX(2px); /* Slight physical shift on 'lock-on' */
      }
      
      .dark #notion-article h1, .dark #notion-article h2, .dark #notion-article h3 {
        /* Dark mode: Stronger, glow-like ghosts */
        text-shadow: 
          -4px -2px 0 rgba(98, 240, 245, 0.5),
          4px 2px 0 rgba(255, 50, 50, 0.4);
      }
      
      .dark #notion-article h1:hover, .dark #notion-article h2:hover, .dark #notion-article h3:hover {
         text-shadow: none;
      }
      
      #notion-article h1::before, 
      #notion-article h2::before,
      #notion-article h3::before {
        content: '';
        position: absolute;
        left: 0; top: 0.2em; bottom: 0.2em;
        width: 6px;
        background: var(--endspace-accent-yellow);
        box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
      }
      
      /* Bar also reacts to hover */
      #notion-article h1:hover::before,
      #notion-article h2:hover::before,
      #notion-article h3:hover::before {
        background: var(--endspace-text-primary);
        width: 8px;
        box-shadow: none;
      }

      /* Quotes */
      #notion-article blockquote {
        background: var(--endspace-bg-secondary);
        border-left: 3px solid var(--endspace-text-primary);
        color: var(--endspace-text-secondary);
        padding: 1.2rem 1.5rem;
        margin: 2rem 0;
        font-style: italic;
      }

      /* Lists */
      #notion-article ul li, #notion-article ol li {
        margin-bottom: 0.5em;
        color: var(--endspace-text-secondary);
      }
      #notion-article ul li::marker {
        color: var(--endspace-accent-cyan);
        font-weight: bold;
      }

      /* Links in Content */
      #notion-article a {
        color: var(--endspace-text-primary);
        text-decoration: none;
        border-bottom: 2px solid var(--endspace-accent-cyan-dim);
        transition: all 0.2s;
        font-weight: 600;
      }
      #notion-article a:hover {
        background: var(--endspace-accent-cyan-dim);
        border-bottom-color: var(--endspace-accent-cyan);
      }

      /* Code Blocks */
      #notion-article pre {
        background: #18181b !important;
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 4px !important;
        box-shadow: var(--endspace-shadow-base);
      }

      /* ============================================
         Buttons (Cut Corner Aesthetic)
         ============================================ */
      .endspace-btn {
        background: transparent;
        border: 2px solid var(--endspace-border-active);
        color: var(--endspace-text-primary);
        padding: 0.6rem 1.5rem;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.85em;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.2s;
      }
      
      .endspace-btn:hover {
        background: var(--endspace-border-active);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .endspace-button-primary {
        background: var(--endspace-border-active);
        border: none;
        color: white;
        padding: 0.75rem 1.5rem;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.85em;
        cursor: pointer;
        transition: all 0.2s;
      }

      .endspace-button-primary:hover {
        background: #2563eb;
        transform: translateY(-1px);
      }

      /* ============================================
         Tech Decorations Utilities (Minimalist)
         ============================================ */
      .scan-line {
        width: 100%;
        height: 1px;
        background: var(--endspace-border-base);
        margin: 1rem 0;
      }

      /* Spectrum bar decoration */
      .spectrum-bar {
        height: 2px;
        background: linear-gradient(90deg, 
          var(--endspace-accent-cyan) 0%, 
          var(--endspace-accent-yellow) 50%, 
          var(--endspace-accent-cyan) 100%
        );
      }

      /* Loading Animation (Spinner) */
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .loading-radar {
        width: 24px; height: 24px;
        border: 2px solid var(--endspace-border-base);
        border-top-color: var(--endspace-text-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      /* Tech corner decoration */
      .tech-corner {
        position: relative;
      }
      .tech-corner::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 8px; height: 8px;
        border-top: 2px solid var(--endspace-accent-cyan);
        border-left: 2px solid var(--endspace-accent-cyan);
      }
      .tech-corner::after {
        content: '';
        position: absolute;
        bottom: 0; right: 0;
        width: 8px; height: 8px;
        border-bottom: 2px solid var(--endspace-accent-cyan);
        border-right: 2px solid var(--endspace-accent-cyan);
      }

      /* ============================================
         Mobile Responsive Styles
         ============================================ */
      
      /* Safe area support for notched devices */
      .safe-area-bottom {
        padding-bottom: env(safe-area-inset-bottom);
      }
      .safe-area-top {
        padding-top: env(safe-area-inset-top);
      }

      /* Mobile-specific adjustments */
      @media (max-width: 767px) {
        /* Smaller grid on mobile */
        #theme-endspace::before {
          background-size: 30px 30px;
        }

        /* Reduce padding on mobile */
        .endspace-frame {
          padding: 1rem !important;
        }

        /* Smaller technical text */
        .tech-text {
          font-size: 0.75rem;
          letter-spacing: 0.3px;
        }

        /* Ensure minimum touch targets */
        button, a, [role="button"] {
          min-height: 44px;
        }

        /* Notion content adjustments */
        #notion-article {
          font-size: 1.1rem;
          line-height: 1.75;
        }

        #notion-article p {
          margin-bottom: 1.25em;
        }
      }

      /* ============================================
         Player Styles
         ============================================ */
      .endspace-player-glow {
        box-shadow: 0 0 10px var(--endspace-accent-yellow);
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .endspace-player-rotating {
        animation: rotate 8s linear infinite;
      }

      /* ============================================
         Scan Line & HUD Animations
         ============================================ */
      
      /* Horizontal Scan Line */
      @keyframes ef-scan-horizontal {
        0% { transform: translateY(-100%); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      
      .ef-scan-line {
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, 
          transparent, 
          var(--endspace-accent-cyan) 20%, 
          var(--endspace-accent-cyan) 80%, 
          transparent
        );
        animation: ef-scan-horizontal 4s linear infinite;
        pointer-events: none;
        opacity: 0.5;
      }
      
      /* Vertical Scan Line */
      @keyframes ef-scan-vertical {
        0% { transform: translateX(-100%); opacity: 0; }
        10% { opacity: 0.8; }
        90% { opacity: 0.8; }
        100% { transform: translateX(100vw); opacity: 0; }
      }

      .ef-scan-line-v {
        position: absolute;
        top: 0;
        width: 1px;
        height: 100%;
        background: linear-gradient(180deg, 
          transparent, 
          var(--endspace-accent-cyan) 30%, 
          var(--endspace-accent-cyan) 70%, 
          transparent
        );
        animation: ef-scan-vertical 6s linear infinite;
        pointer-events: none;
        opacity: 0.3;
      }

      /* Pulse Glow Animation */
      @keyframes ef-pulse-glow {
        0%, 100% { 
          box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
        }
        50% { 
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.3);
        }
      }
      
      .ef-pulse-glow {
        animation: ef-pulse-glow 3s ease-in-out infinite;
      }

      /* ============================================
         Endfield Button Styles
         ============================================ */
      
      /* Button with Left Highlight Bar */
      .ef-button {
        position: relative;
        background: var(--endspace-bg-primary);
        border: 1px solid var(--endspace-border-base);
        padding: 0.75rem 1.5rem 0.75rem 2rem;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.85em;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.2s ease;
      }
      
      .ef-button::before {
        content: '';
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 55%;
        background-color: var(--endspace-accent-yellow);
        transition: all 0.2s ease;
      }
      
      .ef-button:hover {
        background: var(--endspace-border-active);
        color: white;
        border-color: var(--endspace-border-active);
      }
      
      .ef-button:hover::before {
        height: 70%;
        background-color: #FBFB45;
      }

      /* ============================================
         Card Enhancement Styles
         ============================================ */
      
      /* Enhanced Card with texture */
      .ef-card {
        position: relative;
        background: var(--endspace-bg-primary);
        border: 1px solid var(--endspace-border-base);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .ef-card:hover {
        border-color: var(--endspace-accent-yellow);
        box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
        transform: translateY(-2px);
      }

      /* Index Number Badge - Industrial Style */
      .ef-index-badge {
        position: absolute;
        top: -1px;
        left: -1px;
        padding: 0.25rem 0.5rem;
        background: var(--endspace-accent-yellow);
        color: #000;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      /* ============================================
         HUD Corner Decorations
         ============================================ */
      
      .ef-hud-corners {
        position: relative;
      }
      
      /* Top Left HUD */
      .ef-hud-tl::before {
        content: '';
        position: fixed;
        top: 1rem;
        left: 1rem;
        width: 3rem;
        height: 3rem;
        border-top: 2px solid rgba(6, 182, 212, 0.4);
        border-left: 2px solid rgba(6, 182, 212, 0.4);
        pointer-events: none;
        z-index: 50;
      }
      
      /* Bottom Right HUD */
      .ef-hud-br::after {
        content: '';
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        width: 3rem;
        height: 3rem;
        border-bottom: 2px solid rgba(6, 182, 212, 0.4);
        border-right: 2px solid rgba(6, 182, 212, 0.4);
        pointer-events: none;
        z-index: 50;
      }

      /* ============================================
         Glowing Border Animation
         ============================================ */
      
      @keyframes ef-border-glow {
        0%, 100% { 
          border-color: var(--endspace-border-base);
          box-shadow: none;
        }
        50% { 
          border-color: var(--endspace-accent-cyan);
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
        }
      }
      
      .ef-glow-border:hover {
        animation: ef-border-glow 2s ease-in-out infinite;
      }

      /* ============================================
         NieR: Automata Style Title (Reusable)
         ============================================ */
      .nier-title {
        position: relative;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-shadow: 
          2px 2px 0 rgba(98, 240, 245, 0.35),
          4px 4px 0 rgba(98, 240, 245, 0.18),
          6px 6px 10px rgba(0, 0, 0, 0.15);
      }
      
      .dark .nier-title {
        text-shadow: 
          2px 2px 0 rgba(98, 240, 245, 0.45),
          4px 4px 0 rgba(98, 240, 245, 0.25),
          6px 6px 15px rgba(0, 0, 0, 0.6);
      }

      /* ============================================
         3D Button Effects
         ============================================ */
      .endspace-btn-3d {
        position: relative;
        background: var(--endspace-bg-primary);
        border: 2px solid var(--endspace-accent-yellow);
        color: var(--endspace-text-primary);
        padding: 0.75rem 1.5rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
          0 4px 0 rgba(98, 240, 245, 0.6),
          0 6px 12px rgba(0, 0, 0, 0.15);
      }
      
      .endspace-btn-3d:hover {
        transform: translateY(-2px);
        box-shadow: 
          0 6px 0 rgba(98, 240, 245, 0.7),
          0 10px 20px rgba(0, 0, 0, 0.2);
      }
      
      .endspace-btn-3d:active {
        transform: translateY(2px);
        box-shadow: 
          0 2px 0 rgba(98, 240, 245, 0.5),
          0 3px 6px rgba(0, 0, 0, 0.1);
      }

      /* ============================================
         Sidebar & Navigation 3D Depth
         ============================================ */
      .endspace-sidebar-3d {
        box-shadow: 
          4px 0 8px rgba(0, 0, 0, 0.05),
          8px 0 16px rgba(0, 0, 0, 0.03);
      }
      
      .dark .endspace-sidebar-3d {
        box-shadow: 
          4px 0 8px rgba(0, 0, 0, 0.3),
          8px 0 16px rgba(0, 0, 0, 0.2);
      }
      /* ============================================
         NieR: Automata Style Navigation Transition
         ============================================ */
      /* ============================================
         NieR: Automata Style Navigation Transition
         ============================================ */
      .nier-nav-item {
        position: relative;
        overflow: hidden;
        transition: color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 1;
        /* Default Text Color */
        color: var(--endspace-text-muted); 
        border-radius: 1px; /* Rounded corners as seen in screenshot */
        margin-bottom: 2px; /* Slight spacing between items */
      }

      /* Sliding Background Layer */
      .nier-nav-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0%;
        height: 100%;
        background: #E0E0E0; /* Hover: Darker Grey */
        transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: -1;
      }
      
      /* Active / Hover State Text Color */
      .nier-nav-item:hover, .nier-nav-item.active {
        color: var(--endspace-text-primary) !important;
      }
      
      /* Hover State: Slide to full width */
      .nier-nav-item:hover::before {
        width: 100%;
      }

      /* Active State: Always full width with Distinct Color */
      .nier-nav-item.active::before {
        width: 100%;
        background: #EBEBEB; /* Active: Lighter Grey */
      }
      
      /* Target the icon specifically if needed to ensure color fill */
      .nier-nav-item svg, .nier-nav-item .icon-container {
        transition: color 0.3s ease;
        z-index: 2;
      }
      
      /* Removed specific active override to keep consistent grey background */
      
      /* Also update the base hover/active shared rule to use this darker grey */
      
      .dark .nier-nav-item::before {
        background: #f4f4f5; /* Light bg in dark mode */
      }
      .dark .nier-nav-item:hover, .dark .nier-nav-item.active {
        color: #fafafa !important; /* Dark text in dark mode */
      }

      /* ============================================
         Endfield Category Button Styles
         ============================================ */
      /* ============================================
         Endfield Unified Button Styles
         ============================================ */
      /* ============================================
         Endfield Unified Button Styles (High Priority)
         ============================================ */
      .ef-btn {
        display: inline-flex !important;
        align-items: center;
        gap: 0.75rem; /* Space between indicator and text */
        padding: 0.5rem 1rem 0.5rem 0.75rem;
        background-color: #3F3F46 !important; /* Normal: Dark Grey matching screenshot */
        border-radius: 1px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        width: fit-content;
        min-width: min-content;
        border: 1px solid transparent; 
        text-decoration: none !important; /* Remove default link underline */
        position: relative;
        z-index: 10;
      }
      
      .ef-btn:hover {
        background-color: #27272A !important; /* Hover: Darker Grey */
        border-radius: 3px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transform: translateY(-1px);
      }
      
      /* Indicator Element */
      .ef-btn-indicator {
        display: block;
        width: 4px;
        height: 18px;
        background-color: #FBFB45; /* Yellow */
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); /* Rectangle */
      }
      
      .ef-btn:hover .ef-btn-indicator {
        width: 12px;
        height: 12px;
        background-color: #FBFB45;
        clip-path: polygon(0 0, 100% 50%, 0 100%); /* Triangle */
      }
      
      /* Text Styles */
      .ef-btn-text {
        color: #e4e4e7 !important;
        font-weight: 600;
        font-size: 0.95rem;
        letter-spacing: 0.05em;
        white-space: nowrap;
        transition: color 0.3s ease;
      }
      
      .ef-btn:hover .ef-btn-text {
        color: #ffffff !important;
      }
    `}</style>
  )
}
