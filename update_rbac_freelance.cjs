const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add states for Freelancer tracking
if (!content.includes('freelanceCostInput')) {
  content = content.replace(
    /const \[newJobTitle, setNewJobTitle\] = useState\(''\);/,
    `const [newJobTitle, setNewJobTitle] = useState('');\n  const [freelanceCostInput, setFreelanceCostInput] = useState<number | ''>('');\n  const [freelanceDeadlineInput, setFreelanceDeadlineInput] = useState<string>('');\n  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>('');`
  );
}

// 2. Allow all staff to see "+ New Project" button
// The exact line is: `{(activeTab === 'kanban' || activeTab === 'overview') && isManagerOrOwner && (`
content = content.replace(
  /\{\(activeTab === 'kanban' \|\| activeTab === 'overview'\) && isManagerOrOwner && \(/g,
  `{(activeTab === 'kanban' || activeTab === 'overview') && (`
);

// 3. Update Job Details Modal Assignment Select (lines 2346-2374 approx)
const jobDetailsSelectRegex = /<select[\s\S]*?className="input-field"[\s\S]*?onChange=\{\(e\) => \{[\s\S]*?const newAssignee = e\.target\.value;[\s\S]*?if\(newAssignee\) \{[\s\S]*?updateJob\([\s\S]*?\}\)[\s\S]*?\}\}[\s\S]*?>[\s\S]*?<\/select>/;

const newJobDetailsAssign = `
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <select 
                        className="input-field" 
                        value={selectedAssigneeId}
                        onChange={(e) => setSelectedAssigneeId(e.target.value)}
                      >
                        <option value="">Select Editor / Freelancer...</option>
                        {team.filter((t) => t.roleType !== 'owner').map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.roleType})</option>
                        ))}
                      </select>
                      
                      {selectedAssigneeId && team.find(t => t.id === selectedAssigneeId)?.roleType === 'freelance' && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <input 
                            type="number" 
                            placeholder="Agreed Cost ($)" 
                            className="input-field" 
                            style={{ flex: 1 }}
                            value={freelanceCostInput}
                            onChange={(e) => setFreelanceCostInput(e.target.value ? Number(e.target.value) : '')}
                          />
                          <input 
                            type="date" 
                            className="input-field" 
                            style={{ flex: 1 }}
                            value={freelanceDeadlineInput}
                            onChange={(e) => setFreelanceDeadlineInput(e.target.value)}
                          />
                        </div>
                      )}

                      {selectedAssigneeId && (
                        <button 
                          className="btn-primary" 
                          onClick={() => {
                            const assignee = team.find(t => t.id === selectedAssigneeId);
                            const isFreelance = assignee?.roleType === 'freelance';
                            if (isFreelance && (!freelanceCostInput || !freelanceDeadlineInput)) {
                              triggerAlert('Please enter cost and delivery date for freelancer.');
                              return;
                            }
                            updateJob(showJobDetailModal.id, {
                              ...showJobDetailModal,
                              stage: 'assigned',
                              assignedTo: selectedAssigneeId,
                              freelanceCost: isFreelance ? Number(freelanceCostInput) : undefined,
                              freelanceDeadlineDate: isFreelance ? freelanceDeadlineInput : undefined,
                              notes: [...showJobDetailModal.notes, \`[ASSIGNED by \${currentUser?.name} on \${new Date().toLocaleString()}] to \${assignee?.name} \${isFreelance ? \`for $\${freelanceCostInput} due \${freelanceDeadlineInput}\` : ''}\`]
                            });
                            setShowJobDetailModal(null);
                            setSelectedAssigneeId('');
                            setFreelanceCostInput('');
                            setFreelanceDeadlineInput('');
                            triggerAlert('Project assigned successfully.');
                          }}
                        >
                          Confirm Assignment
                        </button>
                      )}
                    </div>
`;

content = content.replace(jobDetailsSelectRegex, newJobDetailsAssign.trim());

// 4. Update Add Client Modal Assignment Select to restrict to manager and remove "required" if hidden
const cliAssigneeLabelRegex = /<label style=\{\{ fontSize: '0.78rem', color: 'var\(--text-muted\)', fontWeight: 600, display: 'block', marginBottom: '4px' \}\}>\s*3\. Whom to Assign[\s\S]*?<\/select>/;

const newCliAssigneeBlock = `
                  {isManagerOrOwner && (
                    <>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        3. Whom to Assign ('Internal PC Seat or Freelance Contractor')
                      </label>
                      <select value={newCliAssignee} onChange={(e) => setNewCliAssignee(e.target.value)} className="input-field">
                        <option value="">Assign Later...</option>
                        <optgroup label="Internal Workstation Staff ('Full-Time')">
                          {team.filter((t) => t.roleType === 'editor' || t.roleType === 'manager').map((t) => (
                            <option key={t.id} value={t.id}>{t.name} • {t.role} ({t.workstationPC || 'Office Seat'})</option>
                          ))}
                        </optgroup>
                        <optgroup label="External Freelance Pool">
                          {team.filter((t) => t.roleType === 'freelance').map((t) => (
                            <option key={t.id} value={t.id}>{t.name} (Remote Contractor)</option>
                          ))}
                        </optgroup>
                      </select>
                    </>
                  )}
`;

content = content.replace(cliAssigneeLabelRegex, newCliAssigneeBlock.trim());


fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx correctly updated.');
