import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "store";
import AppLayout from "layouts/AppLayout";
import Error404Page from "pages/error/404";

describe("App", () => {
  it("should render 404 page when visiting an unknown path", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/nonexistent"]}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="*" element={<Error404Page/>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
