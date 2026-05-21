"use client"
import { Position, Handle } from "@xyflow/react"

interface ConceptNodeProps {
    data: {
        label: string
        masteryLevel?: 'unseen' | 'weak' | 'learning' | 'strong' | 'mastered'
        isMastered?: boolean
    }
}

const ConceptNodes = (props: ConceptNodeProps) => {
    const { data } = props;
    const mastery = data.masteryLevel || 'unseen';
    const isMastered = data.isMastered;

    return (
        <div
            className={`px-5 py-3 shadow-[var(--shadow-md)] rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-lg)] select-none min-w-[140px] text-center font-display ${
                isMastered 
                    ? "border-primary shadow-[var(--shadow-glow)]" 
                    : "border-border-default hover:border-border-strong"
            }`}
            style={{ 
                backgroundColor: `var(--mastery-${mastery})`,
                color: `var(--mastery-${mastery}-text)`
            }}
        >
            {/* Left Handles */}
            <Handle 
                type="target" 
                position={Position.Left} 
                id="target-left" 
                className="!w-2 !h-2 !bg-[#2DD4BF] hover:!scale-125 hover:!bg-[#14B8A6] !transition-all !border-surface-void" 
                style={{ left: -4 }} 
            />
            <Handle 
                type="source" 
                position={Position.Left} 
                id="source-left" 
                className="!w-2 !h-2 !bg-[#2DD4BF] hover:!scale-125 hover:!bg-[#14B8A6] !transition-all !border-surface-void" 
                style={{ left: -4 }} 
            />

            {/* Top Handles */}
            <Handle 
                type="target" 
                position={Position.Top} 
                id="target-top" 
                className="!w-2 !h-2 !bg-[#2DD4BF] hover:!scale-125 hover:!bg-[#14B8A6] !transition-all !border-surface-void" 
                style={{ top: -4 }} 
            />
            <Handle 
                type="source" 
                position={Position.Top} 
                id="source-top" 
                className="!w-2 !h-2 !bg-[#2DD4BF] hover:!scale-125 hover:!bg-[#14B8A6] !transition-all !border-surface-void" 
                style={{ top: -4 }} 
            />

            {/* Content Label */}
            <div className="font-semibold text-sm tracking-wide leading-snug font-body">
                {data.label}
            </div>

            {/* Right Handles */}
            <Handle 
                type="target" 
                position={Position.Right} 
                id="target-right" 
                className="!w-2 !h-2 !bg-[#2DD4BF] hover:!scale-125 hover:!bg-[#14B8A6] !transition-all !border-surface-void" 
                style={{ right: -4 }} 
            />
            <Handle 
                type="source" 
                position={Position.Right} 
                id="source-right" 
                className="!w-2 !h-2 !bg-[#2DD4BF] hover:!scale-125 hover:!bg-[#14B8A6] !transition-all !border-surface-void" 
                style={{ right: -4 }} 
            />

            {/* Bottom Handles */}
            <Handle 
                type="target" 
                position={Position.Bottom} 
                id="target-bottom" 
                className="!w-2 !h-2 !bg-[#2DD4BF] hover:!scale-125 hover:!bg-[#14B8A6] !transition-all !border-surface-void" 
                style={{ bottom: -4 }} 
            />
            <Handle 
                type="source" 
                position={Position.Bottom} 
                id="source-bottom" 
                className="!w-2 !h-2 !bg-[#2DD4BF] hover:!scale-125 hover:!bg-[#14B8A6] !transition-all !border-surface-void" 
                style={{ bottom: -4 }} 
            />
        </div>
    )
}

export default ConceptNodes