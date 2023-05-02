import React from 'react';
import { render, screen } from '@testing-library/react';
import Jumbotron from './Jumbotron';


describe("Jumbotron", () => {
  it("Render OK", () => {
    render(
      <Jumbotron />
    );

    const elemnt = screen.getByText(/The simplest and trendiest Profile Generator!/i);
    expect(elemnt).toBeInTheDocument();
  });
});