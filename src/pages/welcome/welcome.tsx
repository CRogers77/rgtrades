import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { generateOAuthURL } from '@/components/shared';
import { getAppName } from '@/utils/branding';
import './welcome.scss';

const Arrow = () => <span aria-hidden='true'>↗</span>;

const tools = [
    { title: 'Bot workspace', text: 'Your strategies, imports, and trading tools together in one workspace.', icon: 'workspace', href: '/workspace#dashboard' },
    { title: 'Visual bot builder', text: 'Build your trading rules with drag-and-drop blocks. No coding needed.', icon: 'builder', href: '/workspace#bot_builder' },
    { title: 'Market charts', text: 'Study price movements and explore the market before your next setup.', icon: 'chart', href: '/workspace#chart' },
    { title: 'Quick strategies', text: 'Start from a built-in strategy and adjust the settings to your approach.', icon: 'strategy', href: '/workspace#bot_builder' },
    { title: 'Import your bots', text: 'Bring your existing Deriv Bot XML files into the workspace.', icon: 'import', href: '/workspace#dashboard' },
    { title: 'Trading tutorials', text: 'Learn the platform, understand trading blocks, and build with confidence.', icon: 'learn', href: '/workspace#tutorial' },
];
const guides = [
    { title: 'Build it your way', kicker: 'VISUAL BOT BUILDER', text: 'Connect trading blocks, define your conditions, and turn your idea into a strategy. You control the rules.', icon: 'builder', href: '/workspace#bot_builder', label: 'Open bot builder', tags: ['No coding needed', 'Your trading rules'] },
    { title: 'Your workspace, ready when you are', kicker: 'ALL IN ONE PLACE', text: 'Load a bot you already use or start with a fresh strategy. Access your tools from one focused trading workspace.', icon: 'workspace', href: '/workspace#dashboard', label: 'Explore the workspace', tags: ['Import XML bots', 'Built-in strategies'] },
    { title: 'Get to know the market', kicker: 'CHARTS & LEARNING', text: 'Explore charts, work through the tutorials, and test your approach on a demo account before trading real funds.', icon: 'chart', href: '/workspace#chart', label: 'Explore charts', tags: ['Market charts', 'Demo practice'] },
];
const markets = ['Volatility 10', 'Volatility 25', 'Volatility 50', 'Volatility 75', 'Volatility 100', 'Boom & Crash', 'Step Index'];

function ToolIcon({ kind }: { kind: string }) {
    return <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
        {kind === 'chart' ? <path d='M4 3v17h17M7 15l4-5 4 2 6-7' /> : kind === 'builder' ? <><rect x='8' y='3' width='8' height='5' rx='1' /><rect x='2' y='16' width='8' height='5' rx='1' /><rect x='14' y='16' width='8' height='5' rx='1' /><path d='M12 8v4M6 16v-4h12v4' /></> : kind === 'learn' ? <path d='M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3zM12 6v15' /> : kind === 'strategy' ? <path d='M13 2L4 14h7l-1 8 10-13h-8z' /> : kind === 'import' ? <><path d='M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5' /></> : <><rect x='3' y='3' width='7' height='7' rx='1' /><rect x='14' y='3' width='7' height='7' rx='1' /><rect x='3' y='14' width='7' height='7' rx='1' /><rect x='14' y='14' width='7' height='7' rx='1' /></>}
    </svg>;
}

export default function Welcome() {
    const name = getAppName();
    const location = useLocation();
    const [activeGuide, setActiveGuide] = useState(1);
    const [authPending, setAuthPending] = useState<'login' | 'registration' | null>(null);
    const [authError, setAuthError] = useState('');
    const guideRail = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const rail = guideRail.current;
        const card = rail?.children[activeGuide] as HTMLElement | undefined;
        if (!rail || !card || rail.scrollWidth <= rail.clientWidth) return;
        rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }, [activeGuide]);
    const authenticate = async (mode: 'login' | 'registration') => {
        setAuthPending(mode);
        setAuthError('');
        try {
            if (!process.env.NEXT_PUBLIC_DERIV_APP_ID) throw new Error('Unavailable');
            const url = await generateOAuthURL(mode === 'registration' ? 'registration' : undefined);
            if (!url) throw new Error('Unavailable');
            window.location.assign(url);
        } catch {
            setAuthError('Account access is unavailable right now. You can still explore the workspace below.');
            setAuthPending(null);
        }
    };
    if (['#dashboard', '#bot_builder', '#chart', '#tutorial'].includes(location.hash)) {
        return <Navigate to={`/workspace${location.search}${location.hash}`} replace />;
    }
    return (
        <div className='rg-welcome'>
            <a className='rg-skip' href='#main'>Skip to content</a>
            <header className='rg-header'>
                <Link to='/' className='rg-brand' aria-label={`${name} home`}><span className='rg-brand__mark'>RG</span><span>{name}</span></Link>
                <nav aria-label='Main navigation'><a href='#tools'>Explore tools</a><a href='#workspace-guides'>Your workspace</a></nav>
                <div className='rg-header__actions'><button className='rg-button rg-button--ghost rg-button--small' disabled={!!authPending} onClick={() => authenticate('login')}>{authPending === 'login' ? 'Signing in…' : 'Log In'}</button><button className='rg-button rg-button--small' disabled={!!authPending} onClick={() => authenticate('registration')}>{authPending === 'registration' ? 'Opening…' : 'Get Started'}</button></div>
            </header>
            <div className='rg-market-strip' aria-label='Markets available through Deriv'><div className='rg-market-strip__track'>{[0, 1].map(copy => <div className='rg-market-strip__group' key={copy} aria-hidden={copy === 1 ? true : undefined}>{markets.map((market, i) => <span className='rg-market' key={market}><svg width='13' height='13' viewBox='0 0 16 16' fill='none' stroke='currentColor' aria-hidden='true'><path d={i % 3 === 0 ? 'M2 4l4 4 3-2 5 6M10 12h4V8' : 'M2 12l4-4 3 2 5-6M10 4h4v4'} /></svg>{market}<i>·</i></span>)}</div>)}</div></div>
            <main id='main'>
                <section className='rg-hero' aria-labelledby='welcome-title'>
                    <div className='rg-eyebrow'><span /> Your strategies. Real market tools.</div>
                    <h1 id='welcome-title'>Welcome to {name}</h1>
                    <p className='rg-hero__description'>Trading tools for focused execution. Build, load, and run Deriv bot strategies from a workspace made for everyday traders.</p>
                    <div className='rg-hero__actions'><button className='rg-button' disabled={!!authPending} onClick={() => authenticate('login')}><ToolIcon kind='chart' /><span>{authPending === 'login' ? 'Signing in…' : 'Log In and Trade'}</span><Arrow /></button><button className='rg-button rg-button--outline' disabled={!!authPending} onClick={() => authenticate('registration')}><svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.7' aria-hidden='true'><circle cx='9' cy='7' r='4' /><path d='M2 21v-3a7 7 0 0 1 14 0v3M20 7v6m-3-3h6' /></svg>{authPending === 'registration' ? 'Opening…' : 'Create Free Account'}</button></div>
                    {authError && <p className='rg-auth-error' role='alert'>{authError}</p>}
                    <Link className='rg-explore-link' to='/workspace'>Explore the workspace <span aria-hidden='true'>→</span></Link>
                    <section className='rg-guides' id='workspace-guides' aria-labelledby='guides-title'>
                        <h2 id='guides-title'>Your next move starts here</h2>
                        <div className='rg-guides__rail' ref={guideRail}>{guides.map((guide, index) => <article className={`rg-guide${index === activeGuide ? ' rg-guide--active' : ''}`} key={guide.title} aria-label={guide.title}><button className='rg-guide__select' aria-label={`Highlight ${guide.title}`} aria-pressed={index === activeGuide} onClick={() => setActiveGuide(index)}><span className='rg-guide__avatar'><ToolIcon kind={guide.icon} /></span><span><strong>{guide.title}</strong><small>{guide.kicker}</small></span></button><p>{guide.text}</p><div className='rg-guide__tags'>{guide.tags.map(tag => <span key={tag}><span aria-hidden='true'>✓</span> {tag}</span>)}</div><Link to={guide.href}>{guide.label} <Arrow /></Link></article>)}</div>
                        <div className='rg-guide-controls' aria-label='Choose a workspace guide'>{guides.map((guide, index) => <button key={guide.title} aria-label={`Highlight guide ${index + 1}: ${guide.title}`} aria-pressed={activeGuide === index} onClick={() => setActiveGuide(index)} />)}</div>
                    </section>
                    <div className='rg-facts'><div><strong>No-code</strong><span>Visual strategy builder</span></div><div><strong>XML</strong><span>Import your existing bots</span></div><div><strong>Charts</strong><span>Market analysis workspace</span></div><div><strong><i />Demo</strong><span>Practice before going live</span></div></div>
                </section>
                <section className='rg-tools' id='tools' aria-labelledby='tools-title'><div className='rg-tools__inner'><h2 id='tools-title'><ToolIcon kind='workspace' />Everything in one workspace</h2><p className='rg-tools__intro'>A place to build, explore, and put your trading ideas to work.</p><div className='rg-tools__grid'>{tools.map(tool => <Link className='rg-tool' key={tool.title} to={tool.href}><span className='rg-tool__icon'><ToolIcon kind={tool.icon} /></span><h3>{tool.title}</h3><p>{tool.text}</p><span className='rg-tool__arrow' aria-hidden='true'>↗</span></Link>)}</div></div></section>
                <section className='rg-bottom-cta'><div className='rg-eyebrow'>BUILD. TEST. TRADE.</div><h2>Make the workspace yours.</h2><p>Start with a strategy. Get familiar on demo. Trade with a plan.</p><Link className='rg-button' to='/workspace'>Open trading workspace <Arrow /></Link></section>
            </main>
            <footer className='rg-footer'><div><Link to='/' className='rg-brand'><span className='rg-brand__mark'>RG</span><span>{name}</span></Link><nav aria-label='Footer navigation'><Link to='/workspace#dashboard'>Workspace</Link><Link to='/workspace#bot_builder'>Bot builder</Link><Link to='/workspace#tutorial'>Tutorials</Link></nav></div><p>Trading involves risk. Automated strategies do not guarantee profits. Start with a demo account and only trade funds you can afford to lose.</p><small>© {new Date().getFullYear()} {name}. An independent trading workspace. Not affiliated with Deriv.</small></footer>
        </div>
    );
}
