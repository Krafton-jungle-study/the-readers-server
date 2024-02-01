var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const Book = require("../../models/book.js");

// Read (고유 id를 기준으로 책 조회)
router
	.route("/:id")
	.get((req, res) => {
		const id = req.params.id;
		Book.findOne({
			where: {
				id: id,
			},
		})
			.then((book) => {
				res.json({ message: "조회 성공", data: book });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "조회 실패", data: null });
			});
	})
	// UPDATE (책 수정)
	.put((req, res) => {
		const { url } = req.body;
		Book.findByPk(req.params.id)
			.then((book) => {
				if (book) {
					return book.update({
						url: url,
					});
				} else {
					res.status(404).json({ message: "책을 찾을 수 없습니다." });
				}
			})
			.then((updateBook) => {
				res.json({ message: "책 수정 성공", data: updateBook });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "책 수정 실패", data: null });
			});
	})
	// DELETE (책 삭제)
	.delete((req, res) => {
		Book.findByPk(req.params.id)
			.then((book) => {
				if (book) {
					return book.destroy();
				} else {
					res.status(404).json({ message: "책을 찾을 수 없습니다." });
				}
			})
			.then(() => {
				res.json({ message: "책 삭제 성공", data: {} });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "책 삭제 실패", data: null });
			});
	});

router
	// READ (책 검색)
	.route("/")
	.get((req, res) => {
		const bookname = req.query.bookname;

		Book.findAll({
			where: {
				name: {
					[Op.like]: `%${bookname}%`,
				},
			},
		})
			.then((books) => {
				res.json({ message: "검색 성공", data: books });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "검색 실패", data: [] });
			});
	})
	// CREATE (책 추가)
	.post((req, res) => {
		const { name, url } = req.body;
		// 데이터 검증
		if (!name || !url) {
			return res.json({ message: "모든 정보를 입력해주세요.", data: {} });
		}
		// BOOK 모델을 사용하여 데이터베이스에 새로운 책 생성
		Book.create({ name, url })
			.then((book) => {
				res.json({ message: "책 추가 성공", data: book });
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ message: "책 추가 실패", data: {} });
			});
	});

module.exports = router;
