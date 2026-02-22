import { useEffect, useState } from "react";

type Listener = () => void;

const listeners = new Set<Listener>();
let revision = 0;

export function notifyDataChanged() {
	revision += 1;
	for (const listener of listeners) {
		listener();
	}
}

export function subscribeDataChanges(listener: Listener) {
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
}

export function useDataRevision() {
	const [currentRevision, setCurrentRevision] = useState(revision);

	useEffect(() => {
		function handleChange() {
			setCurrentRevision(revision);
		}

		listeners.add(handleChange);

		return () => {
			listeners.delete(handleChange);
		};
	}, []);

	return currentRevision;
}
