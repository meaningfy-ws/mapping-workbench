//Tour.js
import JoyRide from "react-joyride";

// Tour steps
const TOUR_STEPS = [
  {
    target: "#nav_projects",
    content: "Begin with clicking on Projects menu item",
    disableBeacon: true,
    spotlightClicks: true,
    disableOverlayClose: true,
  },
  {
    target: "#add_button",
    content: "Then click on +Add button",
    disableBeacon: true,

  },
  {
    target: "[name='title']",
    content: "Enter Project Name Here",
  },
  {
    target: "#create_button",
    content: "Then click on Create button",
  },
  {
    target: "#nav_mapping\\ packages",
    content: "Then go to Mapping packages page",
  },
];

// Tour component
const Tour = () => {
  return (
    <>
      <JoyRide
        steps={TOUR_STEPS}
        styles={{
          options: {
            zIndex: 10000,
          }
        }}
       // continuous={true}

      />
    </>
  );
};
export default Tour;