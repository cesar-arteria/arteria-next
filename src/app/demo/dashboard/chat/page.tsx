import type * as React from "react";
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";

export const metadata = { title: `Chat | Dashboard | ${appConfig.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
	return (
		<Box
			sx={{
				alignItems: "center",
				display: "flex",
				flex: "1 1 auto",
				flexDirection: "column",
				justifyContent: "center",
				overflowY: "auto",
				p: 3,
			}}
		>
			<Stack spacing={2} sx={{ alignItems: "center" }}>
				<Box component="img" src="/assets/not-found.svg" sx={{ height: "auto", maxWidth: "100%", width: "120px" }} />
				<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="subtitle1">
					Start meaningful conversations!
				</Typography>
			</Stack>
		</Box>
	);
}
