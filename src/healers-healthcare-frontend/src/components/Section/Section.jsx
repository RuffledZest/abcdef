import SectionSvg from "../../assets/svg/SectionSvg";
import PropTypes from "prop-types";

const Section = ({ className, id, crosses, crossesOffset, customPaddings, children }) => {
    return (
        <div id={id} className={`relative ${customPaddings || `py-4 lg:py-8 xl:py-12 ${crosses ? "lg:py-16 xl:py-20" : ""}`} ${className || ""}`}>
            {children}

            {/* <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-[#26242C] pointer-events-none md:block lg:left-7.5 xl:left-10" /> */}
            {/* <div className="hidden absolute top-0 right-5 w-0.25 h-full bg-[#26242C] pointer-events-none md:block lg:right-7.5 xl:right-10" /> */}

            {crosses && (
                <>
                    <div className={`hidden absolute top-0 left-7.5 right-7.5 h-0.25 bg-[#26242C] ${crossesOffset && crossesOffset} pointer-events-none lg:block xl:left-10 right-10`} />
                    <SectionSvg crossesOffset={crossesOffset} />
                </>
            )}
        </div>
    );
};

Section.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    crosses: PropTypes.bool,
    crossesOffset: PropTypes.string,
    customPaddings: PropTypes.string,
    children: PropTypes.node
};


export default Section;