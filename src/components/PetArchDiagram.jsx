import React from 'react';
import { PET_REPOS } from '../data/pet-repos';

/**
 * PetArchDiagram
 * Inline SVG system architecture diagram for PET Recycling Filament System.
 * - Colors exclusively use theme CSS custom properties.
 * - Solid lines indicate built components and links.
 * - Dashed lines indicate the planned ESP32 + MQTT bridge.
 * - Nodes with repos are focusable keyboard-accessible links.
 * - Supports RTL mirroring via isRtl prop.
 */
export default function PetArchDiagram({ isRtl = false, t }) {
  const getText = (key, fallback) => (t ? t(key, fallback) : fallback);

  // Labels
  const titleText = getText('projects.pet.arch.title', 'System Architecture');
  const legendBuilt = getText('projects.pet.arch.legend.built', 'Built');
  const legendPlanned = getText('projects.pet.arch.legend.planned', 'Planned');
  const plannedBadge = getText('projects.pet.arch.plannedBadge', 'Planned');

  const machineTitle = getText('projects.pet.arch.nodes.machine', 'Arduino Machine');
  const machineSub = getText('projects.pet.arch.nodes.machineSub', 'PID & Stepper (V3)');

  const esp32Title = getText('projects.pet.arch.nodes.esp32', 'ESP32 Bridge');
  const esp32Sub = getText('projects.pet.arch.nodes.esp32Sub', 'Bridge Hardware');

  const mqttTitle = getText('projects.pet.arch.nodes.mqtt', 'MQTT Broker');
  const mqttSub = getText('projects.pet.arch.nodes.mqttSub', 'Telemetry Stream');

  const apiTitle = getText('projects.pet.arch.nodes.api', 'Symfony 7.4 API');
  const apiSub = getText('projects.pet.arch.nodes.apiSub', 'PostgreSQL · JWT · 13 EPs');

  const webTitle = getText('projects.pet.arch.nodes.web', 'Web Dashboard');
  const webSub = getText('projects.pet.arch.nodes.webSub', 'React · Vite · TS');

  const mobileTitle = getText('projects.pet.arch.nodes.mobile', 'Mobile App');
  const mobileSub = getText('projects.pet.arch.nodes.mobileSub', 'React Native · Expo');

  // Coordinates mapping (LTR coordinate system: x increases left to right)
  // When isRtl is true, we can invert X coordinates relative to SVG width (800)
  const W = 800;
  const mapX = (x, width) => (isRtl ? W - x - width : x);

  const nodes = {
    machine: { x: mapX(30, 130), y: 125, w: 130, h: 70, url: PET_REPOS.hardware, built: true },
    esp32:   { x: mapX(185, 110), y: 125, w: 110, h: 70, url: null, built: false },
    mqtt:    { x: mapX(320, 110), y: 125, w: 110, h: 70, url: null, built: false },
    api:     { x: mapX(455, 140), y: 125, w: 140, h: 70, url: PET_REPOS.backend, built: true },
    web:     { x: mapX(625, 145), y: 70,  w: 145, h: 65, url: PET_REPOS.web, built: true },
    mobile:  { x: mapX(625, 185), y: 185, w: 145, h: 65, url: PET_REPOS.mobile, built: true },
  };

  // Center connection points
  const getCenterRight = (node) => ({
    x: isRtl ? node.x : node.x + node.w,
    y: node.y + node.h / 2,
  });
  const getCenterLeft = (node) => ({
    x: isRtl ? node.x + node.w : node.x,
    y: node.y + node.h / 2,
  });

  const pMachineOut = getCenterRight(nodes.machine);
  const pEsp32In = getCenterLeft(nodes.esp32);
  const pEsp32Out = getCenterRight(nodes.esp32);
  const pMqttIn = getCenterLeft(nodes.mqtt);
  const pMqttOut = getCenterRight(nodes.mqtt);
  const pApiIn = getCenterLeft(nodes.api);
  const pApiOut = getCenterRight(nodes.api);
  const pWebIn = getCenterLeft(nodes.web);
  const pMobileIn = getCenterLeft(nodes.mobile);

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
            ? 'مخطط بنية النظام: آلة الأردوينو، جسر ESP32 وMQTT المخطط له، واجهة برمجة تطبيقات سيمفوني، وتطبيقات الويب والجوال.'
            : 'Architecture diagram showing the Arduino machine, planned ESP32 & MQTT bridge, Symfony REST API, and Web and Mobile clients.'}
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

        {/* Legend */}
        <g className="pet-arch__legend" transform="translate(30, 25)">
          {/* Built legend item */}
          <line
            x1="0"
            y1="8"
            x2="30"
            y2="8"
            stroke="var(--accent, #06b6d4)"
            strokeWidth="2.5"
          />
          <circle cx="15" cy="8" r="3" fill="var(--accent, #06b6d4)" />
          <text
            x="40"
            y="12"
            fill="var(--text, #f8fafc)"
            fontSize="12"
            fontWeight="600"
            fontFamily="inherit"
          >
            {legendBuilt}
          </text>

          {/* Planned legend item */}
          <g transform="translate(130, 0)">
            <line
              x1="0"
              y1="8"
              x2="30"
              y2="8"
              stroke="var(--muted, #94a3b8)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text
              x="40"
              y="12"
              fill="var(--muted, #94a3b8)"
              fontSize="12"
              fontWeight="500"
              fontFamily="inherit"
            >
              {legendPlanned}
            </text>
          </g>
        </g>

        {/* --- Connections --- */}
        {/* Planned connection: Machine -> ESP32 */}
        <path
          d={`M ${pMachineOut.x} ${pMachineOut.y} L ${pEsp32In.x} ${pEsp32In.y}`}
          stroke="var(--muted, #94a3b8)"
          strokeWidth="2"
          strokeDasharray="4 3"
          markerEnd="url(#arrow-planned)"
        />

        {/* Planned connection: ESP32 -> MQTT */}
        <path
          d={`M ${pEsp32Out.x} ${pEsp32Out.y} L ${pMqttIn.x} ${pMqttIn.y}`}
          stroke="var(--muted, #94a3b8)"
          strokeWidth="2"
          strokeDasharray="4 3"
          markerEnd="url(#arrow-planned)"
        />

        {/* Planned connection: MQTT -> Symfony API */}
        <path
          d={`M ${pMqttOut.x} ${pMqttOut.y} L ${pApiIn.x} ${pApiIn.y}`}
          stroke="var(--muted, #94a3b8)"
          strokeWidth="2"
          strokeDasharray="4 3"
          markerEnd="url(#arrow-planned)"
        />

        {/* Built connection: Symfony API -> Web Dashboard (Curved line) */}
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

        {/* Built connection: Symfony API -> Mobile App (Curved line) */}
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

        {/* --- Node 1: Arduino Machine (Built + Link) --- */}
        <a
          href={nodes.machine.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pet-arch__link-node"
          aria-label={`${machineTitle} - ${getText('projects.pet.repos.viewRepo', 'View repository')}`}
        >
          <g className="pet-arch__node pet-arch__node--built pet-arch__node--interactive">
            <rect
              x={nodes.machine.x}
              y={nodes.machine.y}
              width={nodes.machine.w}
              height={nodes.machine.h}
              rx="10"
              fill="var(--surface, #1e293b)"
              stroke="var(--accent, #06b6d4)"
              strokeWidth="1.5"
            />
            <text
              x={nodes.machine.x + nodes.machine.w / 2}
              y={nodes.machine.y + 28}
              textAnchor="middle"
              fill="var(--text, #f8fafc)"
              fontSize="12.5"
              fontWeight="700"
              fontFamily="inherit"
            >
              {machineTitle}
            </text>
            <text
              x={nodes.machine.x + nodes.machine.w / 2}
              y={nodes.machine.y + 48}
              textAnchor="middle"
              fill="var(--muted, #94a3b8)"
              fontSize="10"
              fontFamily="inherit"
            >
              {machineSub}
            </text>
          </g>
        </a>

        {/* --- Node 2: ESP32 Bridge (Planned) --- */}
        <g className="pet-arch__node pet-arch__node--planned">
          <rect
            x={nodes.esp32.x}
            y={nodes.esp32.y}
            width={nodes.esp32.w}
            height={nodes.esp32.h}
            rx="10"
            fill="var(--surface, #1e293b)"
            stroke="var(--border-strong, #475569)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Planned Pill */}
          <rect
            x={nodes.esp32.x + (nodes.esp32.w - 52) / 2}
            y={nodes.esp32.y - 9}
            width="52"
            height="18"
            rx="9"
            fill="var(--surface-alt, #334155)"
            stroke="var(--border-strong, #475569)"
            strokeWidth="1"
          />
          <text
            x={nodes.esp32.x + nodes.esp32.w / 2}
            y={nodes.esp32.y + 3}
            textAnchor="middle"
            fill="var(--muted, #94a3b8)"
            fontSize="9"
            fontWeight="600"
            fontFamily="inherit"
          >
            {plannedBadge}
          </text>
          <text
            x={nodes.esp32.x + nodes.esp32.w / 2}
            y={nodes.esp32.y + 32}
            textAnchor="middle"
            fill="var(--text, #f8fafc)"
            fontSize="12"
            fontWeight="600"
            fontFamily="inherit"
          >
            {esp32Title}
          </text>
          <text
            x={nodes.esp32.x + nodes.esp32.w / 2}
            y={nodes.esp32.y + 50}
            textAnchor="middle"
            fill="var(--muted, #94a3b8)"
            fontSize="10"
            fontFamily="inherit"
          >
            {esp32Sub}
          </text>
        </g>

        {/* --- Node 3: MQTT Broker (Planned) --- */}
        <g className="pet-arch__node pet-arch__node--planned">
          <rect
            x={nodes.mqtt.x}
            y={nodes.mqtt.y}
            width={nodes.mqtt.w}
            height={nodes.mqtt.h}
            rx="10"
            fill="var(--surface, #1e293b)"
            stroke="var(--border-strong, #475569)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Planned Pill */}
          <rect
            x={nodes.mqtt.x + (nodes.mqtt.w - 52) / 2}
            y={nodes.mqtt.y - 9}
            width="52"
            height="18"
            rx="9"
            fill="var(--surface-alt, #334155)"
            stroke="var(--border-strong, #475569)"
            strokeWidth="1"
          />
          <text
            x={nodes.mqtt.x + nodes.mqtt.w / 2}
            y={nodes.mqtt.y + 3}
            textAnchor="middle"
            fill="var(--muted, #94a3b8)"
            fontSize="9"
            fontWeight="600"
            fontFamily="inherit"
          >
            {plannedBadge}
          </text>
          <text
            x={nodes.mqtt.x + nodes.mqtt.w / 2}
            y={nodes.mqtt.y + 32}
            textAnchor="middle"
            fill="var(--text, #f8fafc)"
            fontSize="12"
            fontWeight="600"
            fontFamily="inherit"
          >
            {mqttTitle}
          </text>
          <text
            x={nodes.mqtt.x + nodes.mqtt.w / 2}
            y={nodes.mqtt.y + 50}
            textAnchor="middle"
            fill="var(--muted, #94a3b8)"
            fontSize="10"
            fontFamily="inherit"
          >
            {mqttSub}
          </text>
        </g>

        {/* --- Node 4: Symfony REST API (Built + Link) --- */}
        <a
          href={nodes.api.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pet-arch__link-node"
          aria-label={`${apiTitle} - ${getText('projects.pet.repos.viewRepo', 'View repository')}`}
        >
          <g className="pet-arch__node pet-arch__node--built pet-arch__node--interactive">
            <rect
              x={nodes.api.x}
              y={nodes.api.y}
              width={nodes.api.w}
              height={nodes.api.h}
              rx="10"
              fill="var(--surface, #1e293b)"
              stroke="var(--accent, #06b6d4)"
              strokeWidth="1.5"
            />
            <text
              x={nodes.api.x + nodes.api.w / 2}
              y={nodes.api.y + 28}
              textAnchor="middle"
              fill="var(--text, #f8fafc)"
              fontSize="12.5"
              fontWeight="700"
              fontFamily="inherit"
            >
              {apiTitle}
            </text>
            <text
              x={nodes.api.x + nodes.api.w / 2}
              y={nodes.api.y + 48}
              textAnchor="middle"
              fill="var(--muted, #94a3b8)"
              fontSize="9.5"
              fontFamily="inherit"
            >
              {apiSub}
            </text>
          </g>
        </a>

        {/* --- Node 5: Web Dashboard (Built + Link) --- */}
        <a
          href={nodes.web.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pet-arch__link-node"
          aria-label={`${webTitle} - ${getText('projects.pet.repos.viewRepo', 'View repository')}`}
        >
          <g className="pet-arch__node pet-arch__node--built pet-arch__node--interactive">
            <rect
              x={nodes.web.x}
              y={nodes.web.y}
              width={nodes.web.w}
              height={nodes.web.h}
              rx="10"
              fill="var(--surface, #1e293b)"
              stroke="var(--border, #334155)"
              strokeWidth="1.5"
            />
            <text
              x={nodes.web.x + nodes.web.w / 2}
              y={nodes.web.y + 26}
              textAnchor="middle"
              fill="var(--text, #f8fafc)"
              fontSize="12"
              fontWeight="700"
              fontFamily="inherit"
            >
              {webTitle}
            </text>
            <text
              x={nodes.web.x + nodes.web.w / 2}
              y={nodes.web.y + 44}
              textAnchor="middle"
              fill="var(--muted, #94a3b8)"
              fontSize="9.5"
              fontFamily="inherit"
            >
              {webSub}
            </text>
          </g>
        </a>

        {/* --- Node 6: Mobile App (Built + Link) --- */}
        <a
          href={nodes.mobile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pet-arch__link-node"
          aria-label={`${mobileTitle} - ${getText('projects.pet.repos.viewRepo', 'View repository')}`}
        >
          <g className="pet-arch__node pet-arch__node--built pet-arch__node--interactive">
            <rect
              x={nodes.mobile.x}
              y={nodes.mobile.y}
              width={nodes.mobile.w}
              height={nodes.mobile.h}
              rx="10"
              fill="var(--surface, #1e293b)"
              stroke="var(--border, #334155)"
              strokeWidth="1.5"
            />
            <text
              x={nodes.mobile.x + nodes.mobile.w / 2}
              y={nodes.mobile.y + 26}
              textAnchor="middle"
              fill="var(--text, #f8fafc)"
              fontSize="12"
              fontWeight="700"
              fontFamily="inherit"
            >
              {mobileTitle}
            </text>
            <text
              x={nodes.mobile.x + nodes.mobile.w / 2}
              y={nodes.mobile.y + 44}
              textAnchor="middle"
              fill="var(--muted, #94a3b8)"
              fontSize="9.5"
              fontFamily="inherit"
            >
              {mobileSub}
            </text>
          </g>
        </a>

        {/* Status text footer inside diagram */}
        <text
          x={isRtl ? 770 : 30}
          y="290"
          textAnchor={isRtl ? "end" : "start"}
          fill="var(--muted, #94a3b8)"
          fontSize="10"
          fontFamily="inherit"
        >
          {getText(
            'projects.pet.arch.note',
            '* Interactive nodes link to their respective repositories. Web and Mobile apps currently poll the API every 10 s.'
          )}
        </text>
      </svg>
    </div>
  );
}
