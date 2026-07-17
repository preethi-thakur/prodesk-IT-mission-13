import Link from "next/link";
export default function Calendar(){return <main className="simple-page"><Link href="/">← Back to workspace</Link><p className="eyebrow">CALENDAR</p><h1>July 2026</h1><div className="calendar">{Array.from({length:31},(_,i)=><div key={i}><b>{i+1}</b>{[8,14,18,20,22].includes(i+1)&&<span>Website task</span>}</div>)}</div></main>}
