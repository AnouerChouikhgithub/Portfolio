import React from 'react';
import { PET_REPOS } from '../data/pet-repos';

/**
 * PetArchDiagram
 * Inline SVG system architecture diagram for PET Recycling Filament System.
 * - Colors exclusively use theme CSS custom properties.
 * - Three states only: Built/Working (solid accent), Verified locally (accent,
 *   dimmed), In progress or planned (dashed, muted).
 * - Nodes with repos are focusable keyboard-accessible links.
 * - Reverse (command) path is drawn below the chain.
 * - Supports RTL mirroring via isRtl prop.
 */
export default function PetArchDiagram({ isRtl = false, t }) {
  const getText = (key, fallback) => (t ? t(key, fallback) : fallback);

  // Legend
  const titleText = getText('projects.pet.arch.title', 'System Architecture');
  const legendBuilt = getText('projects.pet.arch.legend.built', 'Built / Working');
  const legendVerified = getText('projects.pet.arch.legend.verified', 'Verified locally');
  const legendPlanned = getText('projects.pet.arch.legend.planned', 'In progress or planned');

  // Node statuses
  const statusWorking = getText('projects.pet.arch.status.working', 'Working');
  const statusBenchWired = getText('projects.pet.arch.status.benchWired', 'Bench wired');
  const statusInProgress = getText('projects.pet.arch.status.inProgress', 'In progress');
  const statusVerified = getText('projects.pet.arch.status.verified', 'Verified locally');
  const statusBuilt = getText('projects.pet.arch.status.built', 'Built');

  // Node labels
  const machineTitle = getText('projects.pet.arch.nodes.machine', 'Machine');
  const machineSub = getText('projects.pet.arch.nodes.machineSub', 'Extruder · V3');

  const arduinoTitle = getText('projects.pet.arch.nodes.arduino', 'Arduino Mega');
  const arduinoSub = getText('projects.pet.arch.nodes.arduinoSub', 'PID · steppers v1');

  const uartTitle = getText('projects.pet.arch.nodes.uart', 'UART + shifter');
  const uartSub = getText('projects.pet.arch.nodes.uartSub', 'TXS0108E · Serial1');

  const esp32Title = getText('projects.pet.arch.nodes.esp32', 'ESP32 Gateway');
  const esp32Sub = getText('projects.pet.arch.nodes.esp32Sub', 'DevKit V1');

  const mqttTitle = getText('projects.pet.arch.nodes.mqtt', 'MQTT Broker');
  const mqttSub = getText('projects.pet.arch.nodes.mqttSub', 'Mosquitto · QoS 1');

  const apiTitle = getText('projects.pet.arch.nodes.api', 'Symfony API');
  const apiSub = getText('projects.pet.arch.nodes.apiSub', 'PostgreSQL · JWT');

  const webTitle = getText('projects.pet.arch.nodes.web', 'Web Dashboard');
  const webSub = getText('projects.pet.arch.nodes.webSub', 'React · polls 10 s');

  const mobileTitle = getText('projects.pet.arch.nodes.mobile', 'Mobile App');
  const mobileSub = getText('projects.pet.arch.nodes.mobileSub', 'Expo · polls 10 s');

  const commandPathText = getText(
    'projects.pet.arch.commandPath',
    'Command path: apps → API → machine'
  );
  const noteText = getText(
    'projects.pet.arch.note',
    '* Nodes link to their repositories. MQTT is verified on a local broker only — the machine is not connected to the API. Apps poll every 10 s.'
  );

  // Coordinates mapping (LTR coordinate system: x increases left to right)
  // When isRtl is true, we invert X coordinates relative to SVG width (800)
  const W = 800;
  const mapX = (x, width) => (isRtl ? W - x - width : x);

  // state: 'built' | 'verified' | 'planned'
  const nodes = {
    machine: { x: mapX(16, 92), y: 110, w: 92, h: 78, url: PET_REPOS.hardware, state: 'built', status: statusWorking, title: machineTitle, sub: machineSub },
    arduino: { x: mapX(124, 92), y: 110, w: 92, h: 78, url: null, state: 'built', status: statusWorking, title: arduinoTitle, sub: arduinoSub },
    uart: { x: mapX(232, 92), y: 110, w: 92, h: 78, url: null, state: 'planned', status: statusBenchWired, title: uartTitle, sub: uartSub },
    esp32: { x: mapX(340, 92), y: 110, w: 92, h: 78, url: null, state: 'planned', status: statusInProgress, title: esp32Title, sub: esp32Sub },
    mqtt: { x: mapX(448, 92), y: 110, w: 92, h: 78, url: null, state: 'verified', status: statusVerified, title: mqttTitle, sub: mqttSub },
    api: { x: mapX(556, 100), y: 110, w: 100, h: 78, url: PET_REPOS.backend, state: 'built', status: statusBuilt, title: apiTitle, sub: apiSub },
    web: { x: mapX(672, 112), y: 78, w: 112, h: 78, url: PET_REPOS.web, state: 'built', status: statusBuilt, title: webTitle, sub: webSub },
    mobile: { x: mapX(672, 112), y: 170, w: 112, h: 78, url: PET_REPOS.mobile, state: 'built', status: statusBuilt, title: mobileTitle, sub: mobileSub },
  };

  const stateStyle = {
    built: {
      stroke: 'var(--accent, #06b6d4)',
      dash: undefined,
      statusFill: 'var(--accent, #06b6d4)',
      statusOpacity: 1,
    },
    verified: {
      stroke: 'var(--accent, #06b6d4)',
      dash: undefined,
      strokeOpacity: 0.6,
      statusFill: 'var(--accent, #06b6d4)',
      statusOpacity: 0.7,
    },
    planned: {
      stroke: 'var(--border-strong, #475569)',
      dash: '4 3',
      statusFill: 'var(--muted, #94a3b8)',
      statusOpacity: 1,
    },
  };

  // Edge connection points (mirrored for RTL)
  const getCenterRight = (node) => ({
    x: isRtl ? node.x : node.x + node.w,
    y: node.y + node.h / 2,
  });
  const getCenterLeft = (node) => ({
    x: isRtl ? node.x + node.w : node.x,
    y: node.y + node.h / 2,
  });

  // Forward (telemetry/status) chain
  const chain = [
    ['machine', 'arduino', 'built'],
    ['arduino', 'uart', 'planned'],
    ['uart', 'esp32', 'planned'],
    ['esp32', 'mqtt', 'planned'],
    ['mqtt', 'api', 'verified'],
  ];

  const chainStroke = {
    built: { stroke: 'var(--accent, #06b6d4)', dash: undefined, marker: 'url(#arrow-built)' },
    verified: { stroke: 'var(--accent, #06b6d4)', dash: undefined, strokeOpacity: 0.6, marker: 'url(#arrow-verified)' },
    planned: { stroke: 'var(--muted, #94a3b8)', dash: '4 3', marker: 'url(#arrow-planned)' },
  };

  const pApiOut = getCenterRight(nodes.api);
  const pWebIn = getCenterLeft(nodes.web);
  const pMobileIn = getCenterLeft(nodes.mobile);

  // Reverse command path anchor points (below the chain)
  const cmdY = 266;
  const cmdApiX = nodes.api.x + nodes.api.w / 2;
  const cmdMachineX = nodes.machine.x + nodes.machine.w / 2;
  const cmdLabelX = (cmdApiX + cmdMachineX) / 2;

  const viewRepoLabel = getText('projects.pet.repos.viewRepo', 'View repository');

  const renderNode = (key) => {
    const node = nodes[key];
    const style = stateStyle[node.state];
    const cx = node.x + node.w / 2;
    const body = (
      <g className={`pet-arch__node pet-arch__node--${node.state}${node.url ? ' pet-arch__node--interactive' : ''}`}>
        <rect
          x={node.x}
          y={node.y}
          width={node.w}
          height={node.h}
          rx="10"
          fill="var(--surface, #1e293b)"
          stroke={style.stroke}
          strokeWidth="1.5"
          strokeOpacity={style.strokeOpacity}
          strokeDasharray={style.dash}
        />
        <text
          x={cx}
          y={node.y + 26}
          textAnchor="middle"
          fill="var(--text, #f8fafc)"
          fontSize="12"
          fontWeight="700"
          fontFamily="inherit"
        >
          {node.title}
        </text>
        <text
          x={cx}
          y={node.y + 46}
          textAnchor="middle"
          fill="var(--muted, #94a3b8)"
          fontSize="9.5"
          fontFamily="inherit"
        >
          {node.sub}
        </text>
        <text
          x={cx}
          y={node.y + 66}
          textAnchor="middle"
          fill={style.statusFill}
          fillOpacity={style.statusOpacity}
          fontSize="9.5"
          fontWeight="700"
          fontFamily="inherit"
        >
          {node.status}
        </text>
      </g>
    );
    if (!node.url) return <React.Fragment key={key}>{body}</React.Fragment>;
    return (
      <a
        key={key}
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className="pet-arch__link-node"
        aria-label={`${node.title} - ${viewRepoLabel}`}
      >
        {body}
      </a>
    );
  };

  return (
    <div className="pet-arch" aria-label={titleText}>
      <svg
        className="pet-arch__svg"
        viewBox="0 0 800 310"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="pet-arch-title pet-arch-desc"
      >
        <title id="pet-arch-title">{titleText}</title>
        <desc id="pet-arch-desc">
          {isRtl
            ? 'مخطط بنية النظام: آلة PET وArduino Mega (تعملان) متصلتان عبر واجهة UART ومحول مستوى مجهّزين على منضدة ببوابة ESP32 قيد التطوير، ثم وسيط MQTT مُتحقق منه محليًا، وواجهة Symfony مع PostgreSQL، وتطبيقَي الويب والجوال اللذين يطلبان البيانات كل 10 ثوانٍ. الآلة غير متصلة بالواجهة البرمجية.'
            : 'Architecture diagram: the PET machine and Arduino Mega (working), linked through a bench-wired UART and level shifter to an ESP32 gateway in development, a locally verified MQTT broker, the Symfony API with PostgreSQL, and web and mobile apps polling every 10 s. The machine is not connected to the API.'}
        </desc>

        <defs>
          {/* Arrow markers */}
          <marker
            id="arrow-built"
            viewBox="0 0 10 10"
            refX={isRtl ? "1" : "9"}
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent, #06b6d4)" />
          </marker>
          <marker
            id="arrow-verified"
            viewBox="0 0 10 10"
            refX={isRtl ? "1" : "9"}
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent, #06b6d4)" fillOpacity="0.6" />
          </marker>
          <marker
            id="arrow-planned"
            viewBox="0 0 10 10"
            refX={isRtl ? "1" : "9"}
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--muted, #94a3b8)" />
          </marker>
        </defs>

        {/* Legend (three states only) */}
        <g className="pet-arch__legend" transform="translate(24, 25)">
          {/* Built / Working */}
          <line x1="0" y1="8" x2="30" y2="8" stroke="var(--accent, #06b6d4)" strokeWidth="2.5" />
          <circle cx="15" cy="8" r="3" fill="var(--accent, #06b6d4)" />
          <text x="40" y="12" fill="var(--text, #f8fafc)" fontSize="12" fontWeight="600" fontFamily="inherit">
            {legendBuilt}
          </text>

          {/* Verified locally */}
          <g transform="translate(175, 0)">
            <line x1="0" y1="8" x2="30" y2="8" stroke="var(--accent, #06b6d4)" strokeOpacity="0.6" strokeWidth="2.5" />
            <circle cx="15" cy="8" r="3" fill="var(--accent, #06b6d4)" fillOpacity="0.6" />
            <text x="40" y="12" fill="var(--accent, #06b6d4)" fillOpacity="0.75" fontSize="12" fontWeight="600" fontFamily="inherit">
              {legendVerified}
            </text>
          </g>

          {/* In progress or planned */}
          <g transform="translate(340, 0)">
            <line
              x1="0"
              y1="8"
              x2="30"
              y2="8"
              stroke="var(--muted, #94a3b8)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text x="40" y="12" fill="var(--muted, #94a3b8)" fontSize="12" fontWeight="500" fontFamily="inherit">
              {legendPlanned}
            </text>
          </g>
        </g>

        {/* --- Forward chain (telemetry / status) --- */}
        {chain.map(([fromKey, toKey, kind]) => {
          const from = getCenterRight(nodes[fromKey]);
          const to = getCenterLeft(nodes[toKey]);
          const s = chainStroke[kind];
          return (
            <path
              key={`${fromKey}-${toKey}`}
              d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
              stroke={s.stroke}
              strokeOpacity={s.strokeOpacity}
              strokeWidth="2"
              strokeDasharray={s.dash}
              markerEnd={s.marker}
            />
          );
        })}

        {/* Symfony API -> Web Dashboard (curved) */}
        <path
          d={
            isRtl
              ? `M ${pApiOut.x} ${pApiOut.y} C ${pApiOut.x - 20} ${pApiOut.y}, ${pWebIn.x + 20} ${pWebIn.y}, ${pWebIn.x} ${pWebIn.y}`
              : `M ${pApiOut.x} ${pApiOut.y} C ${pApiOut.x + 20} ${pApiOut.y}, ${pWebIn.x - 20} ${pWebIn.y}, ${pWebIn.x} ${pWebIn.y}`
          }
          stroke="var(--accent, #06b6d4)"
          strokeWidth="2.5"
          fill="none"
          markerEnd="url(#arrow-built)"
        />

        {/* Symfony API -> Mobile App (curved) */}
        <path
          d={
            isRtl
              ? `M ${pApiOut.x} ${pApiOut.y} C ${pApiOut.x - 20} ${pApiOut.y}, ${pMobileIn.x + 20} ${pMobileIn.y}, ${pMobileIn.x} ${pMobileIn.y}`
              : `M ${pApiOut.x} ${pApiOut.y} C ${pApiOut.x + 20} ${pApiOut.y}, ${pMobileIn.x - 20} ${pMobileIn.y}, ${pMobileIn.x} ${pMobileIn.y}`
          }
          stroke="var(--accent, #06b6d4)"
          strokeWidth="2.5"
          fill="none"
          markerEnd="url(#arrow-built)"
        />

        {/* --- Reverse command path (apps -> API -> machine) --- */}
        <path
          d={`M ${cmdApiX} ${nodes.api.y + nodes.api.h} L ${cmdApiX} ${cmdY} L ${cmdMachineX} ${cmdY} L ${cmdMachineX} ${nodes.machine.y + nodes.machine.h}`}
          stroke="var(--muted, #94a3b8)"
          strokeWidth="2"
          strokeDasharray="4 3"
          fill="none"
          markerEnd="url(#arrow-planned)"
        />
        <text
          x={cmdLabelX}
          y={cmdY - 8}
          textAnchor="middle"
          fill="var(--muted, #94a3b8)"
          fontSize="10"
          fontFamily="inherit"
        >
          {commandPathText}
        </text>

        {/* --- Nodes --- */}
        {renderNode('machine')}
        {renderNode('arduino')}
        {renderNode('uart')}
        {renderNode('esp32')}
        {renderNode('mqtt')}
        {renderNode('api')}
        {renderNode('web')}
        {renderNode('mobile')}

        {/* Status text footer inside diagram */}
        <text
          x={isRtl ? 776 : 24}
          y="298"
          textAnchor={isRtl ? "end" : "start"}
          fill="var(--muted, #94a3b8)"
          fontSize="10"
          fontFamily="inherit"
        >
          {noteText}
        </text>
      </svg>
    </div>
  );
}
