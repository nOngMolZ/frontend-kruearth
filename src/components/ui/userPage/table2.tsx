"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Table2 = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<div className="relative w-full overflow-hidden text-center bg-white border rounded-lg shadow-md">
		<table
			ref={ref}
			className={cn("w-full caption-bottom text-sm", className)}
			{...props}
		/>
	</div>
));
Table2.displayName = "Table2";

const Table2Header = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
Table2Header.displayName = "Table2Header";

const Table2Body = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props}
	/>
));
Table2Body.displayName = "Table2Body";

const Table2Footer = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn("border-t font-medium [&>tr]:last:border-b-0", className)}
		{...props}
	/>
));
Table2Footer.displayName = "Table2Footer";

const Table2Row = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn(
			"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
			className
		)}
		{...props}
	/>
));
Table2Row.displayName = "Table2Row";

const Table2Head = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			"h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
			className
		)}
		{...props}
	/>
));
Table2Head.displayName = "Table2Head";

const Table2Cell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
		{...props}
	/>
));
Table2Cell.displayName = "Table2Cell";

const Table2Caption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption
		ref={ref}
		className={cn("mt-4 text-sm text-muted-foreground", className)}
		{...props}
	/>
));
Table2Caption.displayName = "Table2Caption";

export {
	Table2,
	Table2Header,
	Table2Body,
	Table2Footer,
	Table2Head,
	Table2Row,
	Table2Cell,
	Table2Caption,
};
