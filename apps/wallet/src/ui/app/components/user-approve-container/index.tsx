// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import cn from 'classnames';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '../../shared/ButtonUI';
import { DAppInfoCard } from '../DAppInfoCard';

import { type PermissionType } from '_src/shared/messaging/messages/payloads/permissions';
import type { ReactNode } from 'react';

type UserApproveContainerProps = {
	children: ReactNode | ReactNode[];
	origin: string;
	originFavIcon?: string;
	rejectTitle: string;
	approveTitle: string;
	approveDisabled?: boolean;
	approveLoading?: boolean;
	onSubmit: (approved: boolean) => Promise<void>;
	isWarning?: boolean;
	addressHidden?: boolean;
	address?: string | null;
	scrollable?: boolean;
	blended?: boolean;
	permissions?: PermissionType[];
};

export function UserApproveContainer({
	origin,
	originFavIcon,
	children,
	rejectTitle,
	approveTitle,
	approveDisabled = false,
	approveLoading = false,
	onSubmit,
	isWarning,
	addressHidden = false,
	address,
	permissions,
}: UserApproveContainerProps) {
	const [submitting, setSubmitting] = useState(false);
	const handleOnResponse = useCallback(
		async (allowed: boolean) => {
			setSubmitting(true);
			await onSubmit(allowed);
			setSubmitting(false);
		},
		[onSubmit],
	);

	const parsedOrigin = useMemo(() => new URL(origin), [origin]);

	return (
		<div className="flex flex-1 flex-col flex-nowrap h-full">
			<div className="flex-1 pb-0 flex flex-col">
				<DAppInfoCard
					name={parsedOrigin.host}
					url={origin}
					permissions={permissions}
					iconUrl={originFavIcon}
					connectedAddress={!addressHidden && address ? address : undefined}
				/>
				<div className="flex flex-1 flex-col p-6 bg-hero-darkest/5">{children}</div>
			</div>
			<div className="sticky bottom-0">
				<div
					className={cn('bg-hero-darkest/5 backdrop-blur-lg py-4 px-5 flex items-center gap-2.5', {
						'flex-row-reverse': isWarning,
					})}
				>
					<Button
						size="tall"
						variant="secondary"
						onClick={() => {
							handleOnResponse(false);
						}}
						disabled={submitting}
						text={rejectTitle}
					/>
					<Button
						size="tall"
						variant={isWarning ? 'secondary' : 'primary'}
						onClick={() => {
							handleOnResponse(true);
						}}
						disabled={approveDisabled}
						loading={submitting || approveLoading}
						text={approveTitle}
					/>
				</div>
			</div>
		</div>
	);
}
