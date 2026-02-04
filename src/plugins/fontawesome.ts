// src/plugins/fontawesome.ts
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

library.add(faChevronLeft, faChevronRight);

export default FontAwesomeIcon;
