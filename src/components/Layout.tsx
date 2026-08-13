import type { ReactNode } from "react";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface Props {
  children: ReactNode;
}

export function Layout({
  children
}: Props) {
  return (
    <div className="app">
      <Sidebar />

      <div className="content">
        <Topbar />

        {children}
      </div>
    </div>
  );
}
