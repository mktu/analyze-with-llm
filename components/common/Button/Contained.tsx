import clsx from "clsx"
import { forwardRef } from "react"
import Base from './Base'

type Props = Parameters<typeof Base>[0] & {
    paddings?: string
}

const Contained = forwardRef<HTMLButtonElement, Props>(({
    paddings = 'py-2 px-4',
    className,
    disabled,
    ...props
}, ref) => (
    <Base ref={ref} className={clsx(className,
        'rounded',
        paddings,
        disabled ? 'bg-gray-500 text-gray-300' :
            'bg-black text-white')} disabled={disabled} disabledStyle='cursor-default' {...props} />
))

Contained['displayName'] = 'contained-button'

export default Contained