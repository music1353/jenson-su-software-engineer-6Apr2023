import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "store";
import Toolbar from "./Toolbar";

describe("Toolbar", () => {
  it("should open SettingModal when button is clicked", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Toolbar />
      </Provider>
    );

    const button = getByTestId("toolbarButton");
    fireEvent.click(button);

    expect(getByTestId("settingModal")).toBeInTheDocument();
  });
});