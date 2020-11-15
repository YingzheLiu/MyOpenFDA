import { createServer, Response } from "miragejs";
import {
  fetchFavorites,
  fetchFavorite,
  saveFavorite,
  fetchComments,
  saveComment,
} from "./api";

let server;
beforeEach(() => {
  server = createServer({
    routes() {
      this.namespace = "api";
      this.logging = false;

      // GET / favorites
      this.get("/favorites", () => {
        return [
          {
            id: 1,
            drugName: "infliximab",
            adverseEvent: "off label use",
            numOfDrugReport: 24127,
            numOfAdverseEventReport: 341410,
            numOfDrugAndAEReport: 2944,
            numOfTotalReport: 12254170,
            dateTime: "11/14/2020 12:45:59",
            startDate: "20001011",
            endDate: "20201103",
          },
          {
            id: 2,
            drugName: "inflectra",
            adverseEvent: "pain",
            numOfDrugReport: 6094,
            numOfAdverseEventReport: 323030,
            numOfDrugAndAEReport: 428,
            numOfTotalReport: 11601792,
            dateTime: "08/11/2020 15:42:01",
            startDate: "20061203",
            endDate: "20201103",
          },
        ];
      });

      // GET / favorite
      this.get("/favorites/:id", (schema, request) => {
        if (request.params.id === "1") {
          return {
            id: 1,
            drugName: "infliximab",
            adverseEvent: "off label use",
            numOfDrugReport: 24127,
            numOfAdverseEventReport: 341410,
            numOfDrugAndAEReport: 2944,
            numOfTotalReport: 12254170,
            dateTime: "11/14/2020 12:45:59",
            startDate: "20001011",
            endDate: "20201103",
          };
        }
        return new Response(404, {}, null);
      });

      // POST /favorites
      this.post("/favorites", (schema, request) => {
        return Object.assign(JSON.parse(request.requestBody), { id: 3 });
      });

      // PUT /favorites/:id
      this.put("/favorites/:id", (schema, request) => {
        return Object.assign(JSON.parse(request.requestBody), {
          drugName: "Updated drug",
        });
      });

      // GET / comments
      this.get("/comments", () => {
        return [
          {
            id: 0,
            author: "nikki",
            text: "Nikki goooo!",
            dateTime: "10/11/2020 01:01:45",
          },
          {
            id: 1,
            author: "david",
            text: "A project!",
            dateTime: "15/11/2020 01:01:45",
          },
        ];
      });

      // POST /comments
      this.post("/comments", (schema, request) => {
        return Object.assign(JSON.parse(request.requestBody), { id: 3 });
      });
    },
  });
});

afterEach(() => {
  server.shutdown();
});

test("fetchFavorites()", () => {
  return fetchFavorites().then((favorites) => {
    expect(favorites).toEqual([
      {
        id: 1,
        drugName: "infliximab",
        adverseEvent: "off label use",
        numOfDrugReport: 24127,
        numOfAdverseEventReport: 341410,
        numOfDrugAndAEReport: 2944,
        numOfTotalReport: 12254170,
        dateTime: "11/14/2020 12:45:59",
        startDate: "20001011",
        endDate: "20201103",
      },
      {
        id: 2,
        drugName: "inflectra",
        adverseEvent: "pain",
        numOfDrugReport: 6094,
        numOfAdverseEventReport: 323030,
        numOfDrugAndAEReport: 428,
        numOfTotalReport: 11601792,
        dateTime: "08/11/2020 15:42:01",
        startDate: "20061203",
        endDate: "20201103",
      },
    ]);
  });
});

test("fetchFavorite(id) with an favorite id that exists", () => {
  return fetchFavorite(1).then((favorite) => {
    expect(favorite).toEqual({
      id: 1,
      drugName: "infliximab",
      adverseEvent: "off label use",
      numOfDrugReport: 24127,
      numOfAdverseEventReport: 341410,
      numOfDrugAndAEReport: 2944,
      numOfTotalReport: 12254170,
      dateTime: "11/14/2020 12:45:59",
      startDate: "20001011",
      endDate: "20201103",
    });
  });
});

test("fetchFavorite(id) with an favorite id that doesn't exist", () => {
  return fetchFavorite(999).then(
    () => () => {},
    (error) => {
      expect(error).toBe(
        "There was an error requesting the favorite with an id of 999"
      );
    }
  );
});

test("saveFavorite() when adding a favorite", () => {
  return saveFavorite({
    drugName: "remicade",
    adverseEvent: "pain",
    numOfDrugReport: 108075,
    numOfAdverseEventReport: 323030,
    numOfDrugAndAEReport: 5010,
    numOfTotalReport: 11601792,
    dateTime: "08/11/2020 15:42:01",
    startDate: "20001011",
    endDate: "20201103",
  }).then((favorite) => {
    expect(favorite).toEqual({
      id: 3,
      drugName: "remicade",
      adverseEvent: "pain",
      numOfDrugReport: 108075,
      numOfAdverseEventReport: 323030,
      numOfDrugAndAEReport: 5010,
      numOfTotalReport: 11601792,
      dateTime: "08/11/2020 15:42:01",
      startDate: "20001011",
      endDate: "20201103",
    });
  });
});

test("saveFavorite() when updating a favorite", () => {
  return saveFavorite({
    id: 2,
    drugName: "inflectra",
    adverseEvent: "pain",
    numOfDrugReport: 6094,
    numOfAdverseEventReport: 323030,
    numOfDrugAndAEReport: 428,
    numOfTotalReport: 11601792,
    dateTime: "08/11/2020 15:42:01",
    startDate: "20061203",
    endDate: "20201103",
  }).then((favorite) => {
    expect(favorite).toEqual({
      id: 2,
      drugName: "Updated drug",
      adverseEvent: "pain",
      numOfDrugReport: 6094,
      numOfAdverseEventReport: 323030,
      numOfDrugAndAEReport: 428,
      numOfTotalReport: 11601792,
      dateTime: "08/11/2020 15:42:01",
      startDate: "20061203",
      endDate: "20201103",
    });
  });
});

test("fetchComments()", () => {
  return fetchComments().then((comments) => {
    expect(comments).toEqual([
      {
        id: 0,
        author: "nikki",
        text: "Nikki goooo!",
        dateTime: "10/11/2020 01:01:45",
      },
      {
        id: 1,
        author: "david",
        text: "A project!",
        dateTime: "15/11/2020 01:01:45",
      },
    ]);
  });
});

test("saveComment() when adding a comment", () => {
  return saveComment({
    author: "guess",
    text: "I added a comment haha",
  }).then((comment) => {
    expect(comment).toEqual({
      id: 3,
      author: "guess",
      text: "I added a comment haha",
    });
  });
});
