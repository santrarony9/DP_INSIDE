import type { TeamMember, JobCard } from '../types';
import { Calendar as CalendarIcon, Clock, Briefcase, Activity, CheckCircle2 } from 'lucide-react';

interface ResourceCalendarProps {
  team: TeamMember[];
  jobs: JobCard[];
}

export default function ResourceCalendar({ team, jobs }: ResourceCalendarProps) {
  const getActiveJob = (userId: string) => {
    return jobs.find(j => j.assignedTo === userId && j.stage !== 'delivered');
  };

  const getDaysActive = (acceptedAt: string | undefined) => {
    if (!acceptedAt) return 0;
    const start = new Date(acceptedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Group team members
  const editors = team.filter(t => t.roleType === 'editor');
  const freelancers = team.filter(t => t.roleType === 'freelance');
  const allWorkers = [...editors, ...freelancers];

  const activeWorkers = allWorkers.filter(w => getActiveJob(w.id));
  const idleWorkers = allWorkers.filter(w => !getActiveJob(w.id));

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* ─── METRICS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="icon-badge bg-gold">
            <Activity size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Currently Editing (Active)</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeWorkers.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>Editors</span></h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(0,0,0,0) 100%)' }}>
          <div className="icon-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Idle & Ready for Work</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{idleWorkers.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>Available</span></h3>
          </div>
        </div>
      </div>

      {/* ─── CALENDAR GRID ─── */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem' }}>Team Workload Timeline</h3>
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>
          {allWorkers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No editors or freelancers found in the system.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {allWorkers.map(worker => {
                const activeJob = getActiveJob(worker.id);
                const daysActive = getDaysActive(activeJob?.acceptedAt);

                return (
                  <div key={worker.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '20px',
                    padding: '16px',
                    backgroundColor: activeJob ? 'rgba(0,0,0,0.2)' : 'rgba(16, 185, 129, 0.05)',
                    border: `1px solid ${activeJob ? 'var(--border-subtle)' : 'rgba(16, 185, 129, 0.2)'}`,
                    borderRadius: '12px'
                  }}>
                    {/* User Info */}
                    <div style={{ width: '220px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '8px', 
                        backgroundColor: activeJob ? 'var(--bg-darkest)' : 'rgba(16, 185, 129, 0.2)',
                        color: activeJob ? 'var(--text-main)' : '#10b981',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 700,
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {worker.avatar}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem', color: activeJob ? 'var(--text-main)' : '#10b981' }}>{worker.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{worker.role} • {worker.workstationPC}</p>
                      </div>
                    </div>

                    {/* Timeline Track */}
                    <div style={{ flex: 1, backgroundColor: 'var(--bg-darkest)', height: '48px', borderRadius: '8px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      {activeJob ? (
                        <div style={{ 
                          position: 'absolute', 
                          left: '0', 
                          top: '0', 
                          height: '100%', 
                          width: `${Math.min(100, Math.max(15, (daysActive / 15) * 100))}%`, 
                          background: 'linear-gradient(90deg, rgba(226, 183, 20, 0.3) 0%, rgba(226, 183, 20, 0.1) 100%)',
                          borderRight: '2px solid var(--accent-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            <Briefcase size={14} color="var(--accent-gold)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-gold)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{activeJob.title}</span>
                          </div>
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981' }}>
                          <CheckCircle2 size={15} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>AVAILABLE FOR ASSIGNMENT</span>
                        </div>
                      )}
                    </div>

                    {/* Meta Data */}
                    <div style={{ width: '120px', flexShrink: 0, textAlign: 'right' }}>
                      {activeJob ? (
                        <div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(226, 183, 20, 0.1)', padding: '4px 10px', borderRadius: '20px', color: 'var(--accent-gold)' }}>
                            <Clock size={12} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{daysActive} {daysActive === 1 ? 'Day' : 'Days'}</span>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>SLA: {activeJob.turnaroundSLA}h</p>
                        </div>
                      ) : (
                        <span className="badge badge-emerald" style={{ fontSize: '0.75rem', display: 'inline-block' }}>IDLE</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
