import React from 'react';
import {
  LineChart,
  Line,
  Area,          // ✅ Added Area import
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Label,
  Legend
} from 'recharts';

export default function WTODualLineGraphFixed() {
  const data = [];
  for (let gdp = 0; gdp <= 70; gdp += 2) {
    // Complainant advantage: starts at +17.3pp, declines by 0.76pp per $1k GDP
    const complainantAdvantage = 17.3 - (0.76 * gdp);

    // Respondent win probability: starts at 31.6%, increases by 0.64pp per $1k GDP
    const respondentWinProb = 31.6 + (0.64 * gdp);

    data.push({
      gdp,
      complainantAdvantage,
      respondentWinProb,
      defenderZone: complainantAdvantage < 0 ? complainantAdvantage : 0 // ✅ Added shaded zone data
    });
  }

  return (
    <div style={{ width: '100%', height: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', height: '100%' }}>
        <h1 style={{ color: '#0066CC', marginBottom: '10px', fontSize: '28px' }}>
          Visual Evidence: Win Rate by Legal Role (n=1,582)
        </h1>
        <h2 style={{ color: '#666', marginBottom: '30px', fontSize: '18px', fontWeight: 'normal' }}>
          H3 Contradiction: Economic Power Favors Defendants
        </h2>
        
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={data} margin={{ top: 20, right: 60, left: 60, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            
            <XAxis 
              dataKey="gdp" 
              label={{ value: 'GDP per Capita (Thousands USD)', position: 'bottom', offset: 20 }}
              domain={[0, 70]}
            />
            
            <YAxis 
              label={{ value: 'Advantage / Win Probability (%)', angle: -90, position: 'left', offset: 10 }}
              domain={[-40, 80]}
            />
            
            {/* 50% reference line (parity) */}
            <ReferenceLine y={50} stroke="#999" strokeWidth={1} strokeDasharray="3 3">
              <Label value="50% Parity" position="right" fill="#666" fontSize={11} />
            </ReferenceLine>
            
            {/* Zero reference line (for complainant advantage) */}
            <ReferenceLine y={0} stroke="#666" strokeWidth={2} strokeDasharray="5 5">
              <Label value="Zero Advantage" position="right" fill="#666" fontSize={11} />
            </ReferenceLine>
            
            {/* Crossover point for complainant advantage */}
            <ReferenceLine 
              x={22.8} 
              stroke="#FFD700" 
              strokeWidth={4}
            >
              <Label 
                value="Crossover: $22.8k" 
                position="top" 
                fill="#000"
                fontSize={14}
                fontWeight="bold"
                style={{ backgroundColor: '#FFEB3B' }}
              />
            </ReferenceLine>
            
            {/* Red shaded area below zero (defendant advantage zone) */}
            <defs>
              <linearGradient id="redZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffcccc" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="#ff9999" stopOpacity={0.5}/>
              </linearGradient>
            </defs>
            
            {/* ✅ Pink shaded area for defendant advantage zone */}
            <Area 
              type="monotone" 
              dataKey="defenderZone"
              fill="url(#redZone)"
              stroke="none"
              fillOpacity={1}
              baseLine={0}
              isAnimationActive={false}
              name="Defendant Advantage Zone"
            />
            
            {/* Blue declining complainant advantage line */}
            <Line 
              type="monotone" 
              dataKey="complainantAdvantage" 
              stroke="#0066CC" 
              strokeWidth={3}
              dot={false}
              name="Complainant Advantage (pp)"
            />
            
            {/* Green rising respondent win probability line */}
            <Line 
              type="monotone" 
              dataKey="respondentWinProb" 
              stroke="#228B22" 
              strokeWidth={3}
              dot={false}
              name="Respondent Win Probability (%)"
            />
            
            {/* Annotations */}
            <text x="3%" y="28%" fill="#0066CC" fontSize="13" fontWeight="bold">At GDP=0:</text>
            <text x="3%" y="31%" fill="#0066CC" fontSize="12">Complainant</text>
            <text x="3%" y="34%" fill="#0066CC" fontSize="12">+17.3pp</text>
            
            <text x="3%" y="62%" fill="#228B22" fontSize="13" fontWeight="bold">At GDP=0:</text>
            <text x="3%" y="65%" fill="#228B22" fontSize="12">Respondent</text>
            <text x="3%" y="68%" fill="#228B22" fontSize="12">31.6%</text>
            
            <text x="85%" y="12%" fill="#228B22" fontSize="13" fontWeight="bold">At GDP=$70k:</text>
            <text x="85%" y="15%" fill="#228B22" fontSize="12">Respondent</text>
            <text x="85%" y="18%" fill="#228B22" fontSize="12">76.4%</text>
            
            <text x="85%" y="85%" fill="#8B0000" fontSize="13" fontWeight="bold">At GDP=$70k:</text>
            <text x="85%" y="88%" fill="#8B0000" fontSize="12">Complainant</text>
            <text x="85%" y="91%" fill="#8B0000" fontSize="12">-35.9pp</text>
            
            <Tooltip 
              formatter={(value, name) => {
                if (name.includes('Advantage')) {
                  return [`${value.toFixed(2)}pp`, name];
                }
                return [`${value.toFixed(2)}%`, name];
              }}
              labelFormatter={(value) => `GDP: $${value}k`} 
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legend explanation boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
          <div style={{ padding: '12px', backgroundColor: '#E3F2FD', borderLeft: '4px solid #0066CC', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#0066CC' }}>Blue Line (Declining):</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
              Complainant advantage drops from +17.3pp to -35.9pp. Each $1k GDP reduces advantage by 0.76pp.
            </p>
          </div>
          
          <div style={{ padding: '12px', backgroundColor: '#E8F5E9', borderLeft: '4px solid #228B22', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#228B22' }}>Green Line (Rising):</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
              Respondent win probability rises from 31.6% to 76.4%. Each $1k GDP adds 0.64pp.
            </p>
          </div>
        </div>
        
       {/* Key insight box */}
<div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#FFF3E0', border: '2px solid #FF9800', borderRadius: '4px' }}>
  <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#E65100' }}>
    ⚠️ H3 Contradiction - The "Scissors Effect":
  </p>
  <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
    As GDP increases, complainant advantage DECLINES while respondent win probability RISES.
    The two lines create a "scissors" pattern, demonstrating that economic power is a defensive
    asset, not an offensive one. Wealth helps you defend your policies far more than it helps
    you challenge others' policies—contradicting structural power theory.
  </p>
</div>