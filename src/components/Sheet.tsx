import {
    Sheet as BaseSheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

  interface Props {
    trigger?: React.ReactNode
    description?: React.ReactNode
    title?: React.ReactNode
  }

export const Sheet = ({ trigger, description, title }: Props) => (

<BaseSheet>
  <SheetTrigger><slot />{trigger}</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      {title && <SheetTitle>{title}</SheetTitle>}
      <SheetDescription>
        {description}
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</BaseSheet>
)