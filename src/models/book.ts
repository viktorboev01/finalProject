export type Book = {
    title: string,
    subject: string,
    author: string,
    language: string
}

export type IssueBook = {
    bookId: string,
    memberId: string,
    issueDate: Date
}