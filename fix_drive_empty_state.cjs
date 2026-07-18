const fs = require('fs');

let tsx = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove default fake initial states
tsx = tsx.replace(
  "const [driveAccount1, setDriveAccount1] = useState('dpinside.raw@gmail.com');",
  "const [driveAccount1, setDriveAccount1] = useState('');"
);
tsx = tsx.replace(
  "const [driveAccount2, setDriveAccount2] = useState('dpinside.edits@gmail.com');",
  "const [driveAccount2, setDriveAccount2] = useState('');"
);
tsx = tsx.replace(
  "const [driveAccount3, setDriveAccount3] = useState('dpinside.archive@gmail.com');",
  "const [driveAccount3, setDriveAccount3] = useState('');"
);
tsx = tsx.replace(
  "const [driveUrl1, setDriveUrl1] = useState('https://drive.google.com/drive/my-drive');",
  "const [driveUrl1, setDriveUrl1] = useState('');"
);
tsx = tsx.replace(
  "const [driveUrl2, setDriveUrl2] = useState('https://drive.google.com/drive/my-drive');",
  "const [driveUrl2, setDriveUrl2] = useState('');"
);
tsx = tsx.replace(
  "const [driveUrl3, setDriveUrl3] = useState('https://drive.google.com/drive/my-drive');",
  "const [driveUrl3, setDriveUrl3] = useState('');"
);

// 2. Fix placeholders in the modal input fields
tsx = tsx.replace(/placeholder="dpinside\.raw@gmail\.com"/g, 'placeholder="E.g., dpinside.raw@gmail.com"');
tsx = tsx.replace(/placeholder="dpinside\.edits@gmail\.com"/g, 'placeholder="E.g., dpinside.edits@gmail.com"');
tsx = tsx.replace(/placeholder="dpinside\.archive@gmail\.com"/g, 'placeholder="E.g., dpinside.archive@gmail.com"');

// 3. Replace the entire 3 Connected 5TB Drive Account block
const oldGridBlock = `              {/* 3 Connected 5TB Drive Account Storage Meters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e11d48' }}>Drive Account #1 (Master Raw Dump)</span>
                    <span className="badge badge-urgent" style={{ fontSize: '0.65rem' }}>Active SD Ingest</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{driveAccount1}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>4.1 TB / 5.0 TB Used</span>
                    <strong style={{ color: '#e11d48' }}>82% Full</strong>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '82%', height: '100%', background: '#e11d48' }}></div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.02)', paddingTop: '6px' }}>
                    Holds: All Cam A/B/C Master 4K SD Card Dumps (\`/RawFootage\`)
                  </div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>Drive Account #2 (Active Edits Vault)</span>
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Workstation Active</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{driveAccount2}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>2.8 TB / 5.0 TB Used</span>
                    <strong style={{ color: '#d97706' }}>56% Full</strong>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '56%', height: '100%', background: '#d97706' }}></div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.02)', paddingTop: '6px' }}>
                    Holds: Premiere Pro Projects, Proxy Files & Scratch Disks (\`/Edits\`)
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>Drive Account #3 (Client Deliverables)</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Review & Archive</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{driveAccount3}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>1.2 TB / 5.0 TB Used</span>
                    <strong style={{ color: '#16a34a' }}>24% Full</strong>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '24%', height: '100%', background: '#16a34a' }}></div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.02)', paddingTop: '6px' }}>
                    Holds: Final 4K Reels, Master Exports & Retouched Photos (\`/FinalDelivery\`)
                  </div>
                </div>
              </div>`;

const newGridBlock = `              {/* Conditional Drive Account Rendering */}
              {(!driveAccount1 && !driveAccount2 && !driveAccount3) ? (
                <div style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)', borderRadius: '12px', padding: '32px', textAlign: 'center', marginBottom: '28px' }}>
                  <HardDrive size={32} color="var(--text-muted)" style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>No Cloud Drives Connected</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 16px' }}>
                    Connect your studio's Google Drive accounts to automatically map client storage folders, synchronize raw dumps, and route final deliveries.
                  </p>
                  <button className="btn-primary" onClick={() => setShowDriveConfigModal(true)}>
                    Connect Drives Now
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                  {driveAccount1 && (
                    <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e11d48' }}>Drive Account #1 (Master Raw Dump)</span>
                        <span className="badge badge-urgent" style={{ fontSize: '0.65rem' }}>Active SD Ingest</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>{driveAccount1}</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#e11d48', fontWeight: 600, marginBottom: '6px' }}>
                        <span>Status: Connected</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.02)', paddingTop: '6px' }}>
                        Holds: All Cam A/B/C Master 4K SD Card Dumps (\`/RawFootage\`)
                      </div>
                    </div>
                  )}

                  {driveAccount2 && (
                    <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>Drive Account #2 (Active Edits)</span>
                        <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Workstation Active</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>{driveAccount2}</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#d97706', fontWeight: 600, marginBottom: '6px' }}>
                        <span>Status: Connected</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.02)', paddingTop: '6px' }}>
                        Holds: Premiere Pro Projects, Proxy Files & Scratch Disks (\`/Edits\`)
                      </div>
                    </div>
                  )}

                  {driveAccount3 && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>Drive Account #3 (Deliverables)</span>
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Review & Archive</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>{driveAccount3}</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#16a34a', fontWeight: 600, marginBottom: '6px' }}>
                        <span>Status: Connected</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.02)', paddingTop: '6px' }}>
                        Holds: Final 4K Reels, Master Exports & Retouched Photos (\`/FinalDelivery\`)
                      </div>
                    </div>
                  )}
                </div>
              )}`;

tsx = tsx.replace(oldGridBlock, newGridBlock);

fs.writeFileSync('src/App.tsx', tsx);
console.log('Successfully updated drive vault empty states');
