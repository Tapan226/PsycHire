import svgPaths from "./svg-ve78d83sqx";
import imgFrame31 from "figma:asset/d2db77d2dcb91b88b0ba32e105c314b8bd750a3b.png";

function Frame8() {
  return (
    <div className="content-stretch flex items-center p-[16px] relative shrink-0">
      <div aria-hidden="true" className="absolute border-[#f6c845] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="css-g0mm18 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f6c845] text-[15px] text-center tracking-[-0.42px]">
        <p className="css-ew64yg leading-[19.6px]">Home</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center p-[16px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-center text-white tracking-[-0.42px]">
        <p className="css-ew64yg leading-[19.6px]">Jobs</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center p-[16px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-center text-white tracking-[-0.42px]">
        <p className="css-ew64yg leading-[19.6px]">Projects</p>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center p-[16px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-center text-white tracking-[-0.42px]">
        <p className="css-ew64yg leading-[19.6px]">Learning</p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center p-[16px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-center text-white tracking-[-0.42px]">
        <p className="css-ew64yg leading-[19.6px]">Community</p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center p-[16px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-center text-white tracking-[-0.42px]">
        <p className="css-ew64yg leading-[19.6px]">Companies</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
      <Frame8 />
      <Frame10 />
      <Frame11 />
      <Frame20 />
      <Frame21 />
      <Frame23 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#35092c] content-stretch flex flex-col items-start left-1/2 px-[80px] top-[64px] w-[1440px]">
      <Frame9 />
    </div>
  );
}

function InobxIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="inobx icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="inobx icon">
          <path d={svgPaths.p3d369a00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[40px]">
      <InobxIcon />
    </div>
  );
}

function NotificationIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="notification icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="notification icon">
          <path d={svgPaths.p18141880} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p385d5e80} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[40px]">
      <NotificationIcon />
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[40px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgFrame31} />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Frame14 />
      <Frame13 />
      <Frame15 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="css-g0mm18 flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#35092c] text-[22px] text-center">
        <p className="css-ew64yg leading-[19.6px]">PsycHire</p>
      </div>
      <Frame24 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[64px] items-center justify-center left-0 px-[80px] py-[10px] top-0 w-[1440px]">
      <Frame16 />
    </div>
  );
}

function ParagraphBackground() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="Paragraph+Background">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic px-[32px] py-[20px] relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[56px] justify-center relative shrink-0 text-[32px] text-black w-full">
          <p className="css-4hzbpn leading-[0.9]">13</p>
        </div>
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[17px] justify-center relative shrink-0 text-[#6c6b6b] text-[14px] tracking-[-0.42px] w-full">
          <p className="css-4hzbpn leading-[19.6px]">Active applications</p>
        </div>
      </div>
    </div>
  );
}

function ParagraphBackground1() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="Paragraph+Background">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic px-[32px] py-[20px] relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[56px] justify-center relative shrink-0 text-[32px] text-black w-full">
          <p className="css-4hzbpn leading-[0.9]">27</p>
        </div>
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[17px] justify-center relative shrink-0 text-[#6c6b6b] text-[14px] tracking-[-0.42px] w-full">
          <p className="css-4hzbpn leading-[19.6px]">Supervision hours</p>
        </div>
      </div>
    </div>
  );
}

function ParagraphBackground2() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="Paragraph+Background">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic px-[32px] py-[20px] relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[56px] justify-center relative shrink-0 text-[32px] text-black w-full">
          <p className="css-4hzbpn leading-[0.9]">3</p>
        </div>
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[17px] justify-center relative shrink-0 text-[#6c6b6b] text-[14px] tracking-[-0.42px] w-full">
          <p className="css-4hzbpn leading-[19.6px]">Active projects</p>
        </div>
      </div>
    </div>
  );
}

function ParagraphBackground3() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="Paragraph+Background">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic px-[32px] py-[20px] relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[56px] justify-center relative shrink-0 text-[32px] text-black w-full">
          <p className="css-4hzbpn leading-[0.9]">1</p>
        </div>
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[17px] justify-center relative shrink-0 text-[#6c6b6b] text-[14px] tracking-[-0.42px] w-full">
          <p className="css-4hzbpn leading-[19.6px]">Upcoming event</p>
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <ParagraphBackground />
      <ParagraphBackground1 />
      <ParagraphBackground2 />
      <ParagraphBackground3 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[27px] items-end left-[120px] top-[336px] w-[1200px]">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[28px] text-black w-full">
        <p className="css-4hzbpn leading-[56px]">Welcome, Jane</p>
      </div>
      <Frame19 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex items-center justify-between not-italic relative shrink-0 w-full">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[24px] text-black text-center tracking-[-0.24px]">
        <p className="css-ew64yg leading-[1.2]">Recommended Mentors</p>
      </div>
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[13px] text-[rgba(0,0,0,0.8)] tracking-[-0.13px]">View All</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="relative shrink-0 size-[94px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 94 94">
        <g id="Frame 49">
          <circle cx="47" cy="47" fill="var(--fill-0, #D7E7C9)" id="Ellipse 1" r="47" />
        </g>
      </svg>
    </div>
  );
}

function Frame29() {
  return (
    <div className="bg-[#d8fff5] content-stretch flex items-center justify-center px-[6px] py-[4px] relative shrink-0">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[12px] text-black">Clinical Psychologist</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start justify-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[18px] text-black tracking-[-0.18px]">Dr. Ananya Rao</p>
      <Frame29 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame30 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)] tracking-[-0.14px] w-[min-content]">
        <span className="leading-[1.6]">{`Specializes in:  `}</span>
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.6] text-[rgba(0,0,0,0.8)]">{`Anxiety · Trauma · CBT   `}</span>
      </p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame26 />
      <Frame27 />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p3b13f000} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)] tracking-[-0.14px]">Mumbai</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.pf98e180} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p1d5cbe80} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame1 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)] tracking-[-0.14px]">8+ yrs experience</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0">
      <Frame32 />
      <Frame33 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-[382px]">
      <div className="content-stretch flex flex-col gap-[32px] items-start overflow-clip p-[28px] relative rounded-[inherit] w-full">
        <Frame28 />
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute inset-[-0.5px_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 326 1">
              <path d="M0 0.5H326" id="Vector 4" stroke="var(--stroke-0, #35092C)" strokeOpacity="0.1" />
            </svg>
          </div>
        </div>
        <Frame31 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex gap-[27px] items-center relative shrink-0 w-full">
      {[...Array(3).keys()].map((_, i) => (
        <Frame36 key={i} />
      ))}
    </div>
  );
}

function Frame47() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-[120px] top-[1651px] w-[1200px]">
      <Frame45 />
      <Frame46 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex items-center justify-between not-italic relative shrink-0 w-full">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[24px] text-black text-center tracking-[-0.24px]">
        <p className="css-ew64yg leading-[1.2]">Recommended Jobs</p>
      </div>
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[13px] text-[rgba(0,0,0,0.8)] tracking-[-0.13px]">View All</p>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[28px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
          <circle cx="14" cy="14" fill="var(--fill-0, #D7E7C9)" id="Ellipse 1" r="14" />
        </svg>
      </div>
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.8)] tracking-[-0.13px]">Psychera Services</p>
    </div>
  );
}

function Frame49() {
  return (
    <div className="bg-[#d8fff5] content-stretch flex items-center justify-center px-[6px] py-[4px] relative shrink-0">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[12px] text-black">Child Psychology</p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start justify-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[18px] text-black tracking-[-0.18px]">Developmental Psychologist</p>
      <Frame49 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame50 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[1.6] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)] tracking-[-0.14px] w-[min-content]">Position Overview We are seeking a highly skilled Family Business Consultant to partner with family...</p>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame48 />
      <Frame51 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p23e41300} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame2 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)] tracking-[-0.14px]">Mumbai</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p26268dc0} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p1d5cbe80} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame3 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)] tracking-[-0.14px]">Senior Level</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p3cef2100} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p54c2080} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M5 10H5.00833M15 10H15.0083" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame4 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)] tracking-[-0.14px]">$5000-10000</p>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0">
      <Frame53 />
      <Frame54 />
      <Frame34 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-[575px]">
      <div className="content-stretch flex flex-col gap-[32px] items-start overflow-clip p-[28px] relative rounded-[inherit] w-full">
        <Frame52 />
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute inset-[-0.5px_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 519 1">
              <path d="M0 0.5H519" id="Vector 4" stroke="var(--stroke-0, #35092C)" strokeOpacity="0.1" />
            </svg>
          </div>
        </div>
        <Frame55 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[28px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
          <circle cx="14" cy="14" fill="var(--fill-0, #C9DDE7)" id="Ellipse 1" r="14" />
        </svg>
      </div>
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.8)] tracking-[-0.13px]">Psychera Services</p>
    </div>
  );
}

function Frame58() {
  return (
    <div className="bg-[rgba(179,239,239,0.5)] content-stretch flex items-center justify-center px-[6px] py-[4px] relative shrink-0">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[12px] text-black">Child Psychology</p>
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start justify-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[18px] text-black tracking-[-0.18px]">Developmental Psychologist</p>
      <Frame58 />
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame59 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[1.6] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)] tracking-[-0.14px] w-[min-content]">Position Overview We are seeking a highly skilled Family Business Consultant to partner with family...</p>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame57 />
      <Frame60 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p23e41300} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame5 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)] tracking-[-0.14px]">Mumbai</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p26268dc0} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p1d5cbe80} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame6 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)] tracking-[-0.14px]">Senior Level</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p3cef2100} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p54c2080} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M5 10H5.00833M15 10H15.0083" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame7 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)] tracking-[-0.14px]">$5000-10000</p>
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0">
      <Frame62 />
      <Frame63 />
      <Frame64 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-[575px]">
      <div className="content-stretch flex flex-col gap-[32px] items-start overflow-clip p-[28px] relative rounded-[inherit] w-full">
        <Frame61 />
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute inset-[-0.5px_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 519 1">
              <path d="M0 0.5H519" id="Vector 4" stroke="var(--stroke-0, #35092C)" strokeOpacity="0.1" />
            </svg>
          </div>
        </div>
        <Frame65 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[50px] items-center relative shrink-0 w-full">
      <Frame56 />
      <Frame66 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-end left-[117px] top-[1180px] w-[1203px]">
      <Frame42 />
      <Frame43 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex items-center justify-between not-italic relative shrink-0 w-full">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[24px] text-black text-center tracking-[-0.24px]">
        <p className="css-ew64yg leading-[1.2]">Upcoming</p>
      </div>
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[13px] text-[rgba(0,0,0,0.8)] tracking-[-0.13px]">View All</p>
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[18px] text-black tracking-[-0.18px]">Supervision session with Dr. Puneet</p>
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame67 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[1.6] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)] tracking-[-0.14px]">{`Tomorrow, 4 PM `}</p>
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <Frame68 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[32px] items-start px-[28px] py-[24px] relative w-full">
          <div className="aspect-[38/38] relative self-stretch shrink-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
              <circle cx="30" cy="30" fill="var(--fill-0, #D7E7C9)" id="Ellipse 1" r="30" />
            </svg>
          </div>
          <Frame69 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[18px] text-black tracking-[-0.18px]">EWT Project - Psychology App Development</p>
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame70 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[1.6] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)] tracking-[-0.14px]">Deadline: 28th Oct, Friday</p>
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <Frame71 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[32px] items-start px-[28px] py-[24px] relative w-full">
          <div className="aspect-[38/38] relative self-stretch shrink-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
              <circle cx="30" cy="30" fill="var(--fill-0, #D7E7C9)" id="Ellipse 1" r="30" />
            </svg>
          </div>
          <Frame72 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[806px]">
      <Frame25 />
      {[...Array(2).keys()].map((_, i) => (
        <Frame35 key={i} />
      ))}
    </div>
  );
}

function Component() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+44.07px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[107.63px]" data-name="01">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">01</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+88.14px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[107.63px]" data-name="02">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">02</p>
    </div>
  );
}

function Component2() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+132.21px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[107.63px]" data-name="03">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">03</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-132.21px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[151.7px]" data-name="04">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">04</p>
    </div>
  );
}

function Component4() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-88.14px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[151.7px]" data-name="05">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">05</p>
    </div>
  );
}

function Component5() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-44.07px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[151.7px]" data-name="06">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">06</p>
    </div>
  );
}

function Component6() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-1/2 p-[3.39px] rounded-[8.475px] size-[33.9px] top-[151.7px]" data-name="07">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">07</p>
    </div>
  );
}

function Component7() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+44.07px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[151.7px]" data-name="08">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">08</p>
    </div>
  );
}

function Component8() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+88.14px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[151.7px]" data-name="09">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">09</p>
    </div>
  );
}

function Component9() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+132.21px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[151.7px]" data-name="10">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">10</p>
    </div>
  );
}

function Component10() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-132.21px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[195.77px]" data-name="11">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">11</p>
    </div>
  );
}

function Component11() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#ffeda9] content-stretch flex flex-col items-center justify-center left-[calc(50%-88.14px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[195.77px]" data-name="12">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">12</p>
    </div>
  );
}

function Component12() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-44.07px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[195.77px]" data-name="13">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">13</p>
    </div>
  );
}

function Component13() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-1/2 p-[3.39px] rounded-[8.475px] size-[33.9px] top-[195.77px]" data-name="14">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">14</p>
    </div>
  );
}

function Component14() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+44.07px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[195.77px]" data-name="15">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">15</p>
    </div>
  );
}

function Component15() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+88.14px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[195.77px]" data-name="16">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">16</p>
    </div>
  );
}

function Component16() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+132.21px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[195.77px]" data-name="17">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">17</p>
    </div>
  );
}

function Component17() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-132.21px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[239.84px]" data-name="18">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">18</p>
    </div>
  );
}

function Component18() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-88.14px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[239.84px]" data-name="19">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">19</p>
    </div>
  );
}

function Component19() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-44.07px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[239.84px]" data-name="20">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">20</p>
    </div>
  );
}

function Component20() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-1/2 p-[3.39px] rounded-[8.475px] size-[33.9px] top-[239.84px]" data-name="21">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">21</p>
    </div>
  );
}

function Component21() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+44.07px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[239.84px]" data-name="22">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">22</p>
    </div>
  );
}

function Component22() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+88.14px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[239.84px]" data-name="23">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">23</p>
    </div>
  );
}

function Component23() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+132.21px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[239.84px]" data-name="24">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">24</p>
    </div>
  );
}

function Component24() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-132.21px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[283.91px]" data-name="25">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">25</p>
    </div>
  );
}

function Component25() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-88.14px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[283.91px]" data-name="26">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">26</p>
    </div>
  );
}

function Component26() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%-44.07px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[283.91px]" data-name="27">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">27</p>
    </div>
  );
}

function Component27() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-1/2 p-[3.39px] rounded-[8.475px] size-[33.9px] top-[283.91px]" data-name="28">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">28</p>
    </div>
  );
}

function Component28() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+44.07px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[283.91px]" data-name="29">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">29</p>
    </div>
  );
}

function Component29() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+88.14px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[283.91px]" data-name="30">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">30</p>
    </div>
  );
}

function Component30() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-[calc(50%+132.21px)] p-[3.39px] rounded-[8.475px] size-[33.9px] top-[283.91px]" data-name="31">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.255px] text-black">31</p>
    </div>
  );
}

function Monday() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-132.21px)] rounded-[8.475px] size-[33.9px] top-[60.17px]" data-name="Monday">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[5.08px] not-italic text-[15.255px] text-black top-[5.51px]">Mo</p>
    </div>
  );
}

function Tuesday() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-88.14px)] rounded-[8.475px] size-[33.9px] top-[60.17px]" data-name="Tuesday">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[7.42px] not-italic text-[15.255px] text-black top-[5.51px]">Tu</p>
    </div>
  );
}

function Wednesday() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-44.07px)] rounded-[8.475px] size-[33.9px] top-[60.17px]" data-name="Wednesday">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[4.24px] not-italic text-[15.255px] text-black top-[5.51px]">We</p>
    </div>
  );
}

function Thrusday() {
  return (
    <div className="-translate-x-1/2 absolute left-1/2 rounded-[8.475px] size-[33.9px] top-[60.17px]" data-name="Thrusday">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[7.42px] not-italic text-[15.255px] text-black top-[5.51px]">Th</p>
    </div>
  );
}

function Friday() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%+44.07px)] rounded-[8.475px] size-[33.9px] top-[60.17px]" data-name="Friday">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[9.75px] not-italic text-[15.255px] text-black top-[5.51px]">Fr</p>
    </div>
  );
}

function Saturday() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%+88.14px)] rounded-[8.475px] size-[33.9px] top-[60.17px]" data-name="Saturday">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[6.99px] not-italic text-[15.255px] text-black top-[5.51px]">Sa</p>
    </div>
  );
}

function Sunday() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%+132.21px)] rounded-[8.475px] size-[33.9px] top-[60.17px]" data-name="Sunday">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[7.2px] not-italic text-[15.255px] text-black top-[5.51px]">Su</p>
    </div>
  );
}

function PreviousMonth() {
  return (
    <div className="relative rounded-[8.475px] size-[33.9px]" data-name="Previous month">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[12.29px] not-italic text-[15.255px] text-black top-[5.51px]">{`>`}</p>
    </div>
  );
}

function NextMonth() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%+132.21px)] rounded-[8.475px] size-[33.9px] top-[11.44px]" data-name="Next Month">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[12.29px] not-italic text-[15.255px] text-black top-[5.51px]">{`>`}</p>
    </div>
  );
}

function July() {
  return (
    <div className="bg-white overflow-clip relative rounded-[16.95px] shrink-0 size-[339px]" data-name="July, 2024">
      <Component />
      <Component1 />
      <Component2 />
      <Component3 />
      <Component4 />
      <Component5 />
      <Component6 />
      <Component7 />
      <Component8 />
      <Component9 />
      <Component10 />
      <Component11 />
      <Component12 />
      <Component13 />
      <Component14 />
      <Component15 />
      <Component16 />
      <Component17 />
      <Component18 />
      <Component19 />
      <Component20 />
      <Component21 />
      <Component22 />
      <Component23 />
      <Component24 />
      <Component25 />
      <Component26 />
      <Component27 />
      <Component28 />
      <Component29 />
      <Component30 />
      <Monday />
      <Tuesday />
      <Wednesday />
      <Thrusday />
      <Friday />
      <Saturday />
      <Sunday />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute css-g0mm18 flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-[calc(50%+0.94px)] not-italic text-[15.255px] text-black text-center top-[28.03px]">
        <p className="css-ew64yg leading-[normal]">July, 2023</p>
      </div>
      <div className="-translate-x-1/2 absolute flex items-center justify-center left-[calc(50%-132.21px)] size-[33.9px] top-[11.44px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <PreviousMonth />
        </div>
      </div>
      <NextMonth />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[372px] items-center justify-center relative rounded-[4px] shrink-0 w-[354px]">
      <div aria-hidden="true" className="absolute border-[0.692px] border-[rgba(40,3,15,0.2)] border-solid inset-[-0.692px] pointer-events-none rounded-[4.692px]" />
      <July />
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full">
      <Frame39 />
      <Frame22 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-end left-[120px] top-[647px] w-[1200px]">
      <Frame38 />
      <Frame40 />
    </div>
  );
}

function Job() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="job">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="job">
          <path clipRule="evenodd" d={svgPaths.p33f01500} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#dfeaff] content-stretch flex gap-[16px] items-center p-[32px] relative rounded-[8px] shrink-0" data-name="Background">
      <Job />
      <div className="css-g0mm18 flex flex-col font-['Georgia:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#28030f] text-[18px] tracking-[-0.18px]">
        <p className="css-ew64yg leading-[30px]">Recommended jobs</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[12.5%_6.54%_12.5%_6.53%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.8163 24">
        <g id="Group">
          <path d={svgPaths.p318e5e00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Mentor() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="mentor">
      <Group />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#e5f6e0] content-stretch flex gap-[16px] items-center p-[32px] relative rounded-[8px] shrink-0" data-name="Background">
      <Mentor />
      <div className="css-g0mm18 flex flex-col font-['Georgia:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#28030f] text-[18px] tracking-[-0.18px]">
        <p className="css-ew64yg leading-[30px]">Find Mentors</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[10.86%_12.5%_12.16%_14.1%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4893 24.635">
        <g id="Group 16612">
          <path clipRule="evenodd" d={svgPaths.p102f2580} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p33204980} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Course() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="course">
      <Group1 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#faede1] content-stretch flex gap-[16px] items-center p-[32px] relative rounded-[8px] shrink-0" data-name="Background">
      <Course />
      <div className="css-g0mm18 flex flex-col font-['Georgia:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#28030f] text-[18px] tracking-[-0.18px]">
        <p className="css-ew64yg leading-[30px]">Explore courses</p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-center left-[120px] top-[168px]">
      <Background />
      <Background1 />
      <Background2 />
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="bg-[#fcfaf8] relative size-full" data-name="Desktop - 3">
      <Frame12 />
      <Frame17 />
      <Frame37 />
      <Frame47 />
      <Frame44 />
      <Frame41 />
      <Frame18 />
    </div>
  );
}