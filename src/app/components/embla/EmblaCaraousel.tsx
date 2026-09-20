
import React, { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from '@/app/components/embla/EmblaCaraouselDotButton'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '@/app/components/embla/EmblaCaraouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import './embla.css'


type PropType = {
    slides: number[]
    options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((index) => (
                        <div className="embla__slide" key={index}>
                            <div className="embla__slide__number">{index + 1}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls">
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>

                <div className="embla__dots">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={'embla__dot'.concat(
                                index === selectedIndex ? ' embla__dot--selected' : ''
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EmblaCarousel




// import React, { useCallback } from 'react'
// import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
// import { DotButton, useDotButton } from '@/app/components/embla/EmblaCaraouselDotButton'
// import {
//     PrevButton,
//     NextButton,
//     usePrevNextButtons
// } from '@/app/components/embla/EmblaCaraouselArrowButtons'
// import Autoplay from 'embla-carousel-autoplay'
// import useEmblaCarousel from 'embla-carousel-react'
// import './embla.css'
//
//
// type PropType = {
//     slides: React.ReactNode[]
//     options?: EmblaOptionsType
// }
//
//
// const EmblaCarousel: React.FC<PropType> = (props) => {
//     const { slides, options } = props
//     const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])
//
//     const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
//         const autoplay = emblaApi?.plugins()?.autoplay
//         if (!autoplay) return
//
//         const resetOrStop =
//             autoplay.options.stopOnInteraction === false
//                 ? autoplay.reset
//                 : autoplay.stop
//
//         resetOrStop()
//     }, [])
//
//     const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
//         emblaApi,
//         onNavButtonClick
//     )
//
//     const {
//         prevBtnDisabled,
//         nextBtnDisabled,
//         onPrevButtonClick,
//         onNextButtonClick
//     } = usePrevNextButtons(emblaApi, onNavButtonClick)
//
//     return (
//         <section className="embla">
//             <div className="embla__viewport" ref={emblaRef}>
//                 <div className="embla__container">
//                     {slides.map((SlideDataElement, index) => (
//                         <div className="embla__slide" key={index}>
//                             {/*<div className="embla__slide__number">{index + 1}</div>*/}
//                             {SlideDataElement}
//
//                         </div>
//                     ))}
//                 </div>
//             </div>
//
//             <div className="embla__controls">
//                 <div className="embla__buttons">
//                     <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
//                     <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
//                 </div>
//
//                 <div className="embla__dots">
//                     {scrollSnaps.map((_, index) => (
//                         <DotButton
//                             key={index}
//                             onClick={() => onDotButtonClick(index)}
//                             className={'embla__dot'.concat(
//                                 index === selectedIndex ? ' embla__dot--selected' : ''
//                             )}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </section>
//     )
// }
//
// export default EmblaCarousel
