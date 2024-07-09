import React, { SetStateAction } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// noOfPages={noOfPages}
//               itemsPerPage={noOfCitiesPerPage}
//               currPage={currPage}
//               setCurrPage={setCurrPage}

type PaginateProps = {
  noOfPages: number;
  currPage: number;
  setCurrPage: React.Dispatch<SetStateAction<number>>;
};

const Paginate = ({ noOfPages, currPage, setCurrPage }: PaginateProps) => {
  let pages = [];
  for (let i = 1; i <= noOfPages; i++) {
    pages.push(i);
  }

  return (
    <>
      <Pagination>
        <PaginationContent>
          {currPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrPage((prevPage) => prevPage - 1)}
                href="#"
              />
            </PaginationItem>
          )}
          {pages.map((page, i) => {
            return (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrPage(page)}
                  isActive={page === currPage}
                  href="#"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          {currPage < pages.length && (
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrPage((prevPage) => prevPage + 1)}
                href="#"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default Paginate;
