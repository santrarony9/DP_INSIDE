import type { TeamMember, JobCard } from '../types';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AnalyticsDashboardProps {
  team: TeamMember[];
  jobs: JobCard[];
}

const AnalyticsDashboard = ({ team, jobs }: AnalyticsDashboardProps) => {
  // Calculate analytics for all team members except owners
  const editors = team.filter((t) => t.roleType !== 'owner');

  const calculateMetrics = (empId: string) => {
    // If it's the freelance pool, we might want to break it down, but for now we treat it as one bucket
    const assignedJobs = jobs.filter(j => j.assignedTo === empId);
    
    const totalAssigned = assignedJobs.length;
    const totalCompleted = assignedJobs.filter(j => j.stage === 'delivered').length;
    const slaBreaches = assignedJobs.filter(j => j.isOverdue).length;
    
    // Calculate cancellation requests based on the notes history (since if it was approved, assignedTo is null now)
    const empName = team.find(t => t.id === empId)?.name || '';
    const cancellationCount = jobs.filter(j => 
      j.notes.some(n => n.includes(`CANCELLATION REQUESTED by ${empName}`))
    ).length;

    // Calculate Efficiency: Total Logged Hours vs Total Estimated Hours (only for delivered jobs to be fair)
    const deliveredJobs = assignedJobs.filter(j => j.stage === 'delivered');
    const totalEstimated = deliveredJobs.reduce((acc, job) => acc + job.estimatedHours, 0);
    const totalLogged = deliveredJobs.reduce((acc, job) => acc + job.loggedHours, 0);
    
    let efficiencyRatio = 100;
    if (totalEstimated > 0) {
      // If logged hours < estimated, efficiency is > 100%. If logged > estimated, efficiency < 100%
      efficiencyRatio = Math.round((totalEstimated / (totalLogged || 1)) * 100);
    }

    return {
      totalAssigned,
      totalCompleted,
      slaBreaches,
      cancellationCount,
      efficiencyRatio
    };
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '1.24rem', fontWeight: 800, color: 'var(--text-main)' }}>EMPLOYEE PERFORMANCE & ANALYTICS</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Hard data on project completion rates, SLA breaches, and efficiency.</p>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TrendingUp color="#16a34a" size={20} />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Studio Overall Completion</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a' }}>
              {jobs.filter(j => j.stage === 'delivered').length} / {jobs.length} Projects
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {editors.map((emp) => {
          const metrics = calculateMetrics(emp.id);
          const isStruggling = metrics.cancellationCount > 0 || metrics.slaBreaches > 1 || metrics.efficiencyRatio < 80;

          return (
            <div key={emp.id} className="clean-card" style={{ 
              padding: '20px', 
              borderColor: isStruggling ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)',
              boxShadow: isStruggling ? '0 0 15px rgba(239, 68, 68, 0.1)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.5rem', background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '12px' }}>{emp.avatar}</span>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{emp.name}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.role}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.05)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} color="#16a34a" /> Delivered
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    {metrics.totalCompleted} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>/ {metrics.totalAssigned}</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.05)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} color="#0284c7" /> Efficiency
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: metrics.efficiencyRatio >= 100 ? '#16a34a' : '#d97706', marginTop: '4px' }}>
                    {metrics.totalCompleted === 0 ? 'N/A' : `${metrics.efficiencyRatio}%`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(244, 63, 94, 0.08)', padding: '10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} /> SLA Breaches (Overdue)
                  </span>
                  <strong style={{ color: '#e11d48' }}>{metrics.slaBreaches}</strong>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BarChart3 size={14} /> Cancellation Requests
                  </span>
                  <strong style={{ color: '#dc2626' }}>{metrics.cancellationCount}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
